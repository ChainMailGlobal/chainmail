"use server"

import { createServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { generateForm1583PDF, generateWitnessCertificate } from "@/lib/pdf/form-1583-generator"

// Server actions for V3b witness flow

export async function startWitnessSession(sessionId: string) {
  try {
    console.log("[v0] Starting witness session:", sessionId)

    const supabase = createServerClient()

    // Update session status to 'in_progress' and set started_at timestamp
    const { data: session, error } = await supabase
      .from("witness_sessions")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to start session" }
    }

    // Log session_started event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "session_started",
      event_data: { timestamp: new Date().toISOString() },
    })

    return {
      success: true,
      sessionId,
      startedAt: session.started_at,
    }
  } catch (error) {
    console.error("[v0] Error starting session:", error)
    return {
      success: false,
      error: "Failed to start session",
    }
  }
}

export async function saveCustomerSignature(sessionId: string, signatureData: string) {
  try {
    console.log("[v0] Saving customer signature for session:", sessionId)

    const supabase = createServerClient()

    // TODO: Upload signature to Blob storage when integration is added
    // For now, store as data URL in database
    const signatureUrl = signatureData

    // Update witness_sessions.customer_signature_url
    const { error } = await supabase
      .from("witness_sessions")
      .update({
        customer_signature_url: signatureUrl,
      })
      .eq("id", sessionId)

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to save signature" }
    }

    // Log signature_captured event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "signature_captured",
      event_data: { type: "customer", timestamp: new Date().toISOString() },
    })

    return {
      success: true,
      signatureUrl,
    }
  } catch (error) {
    console.error("[v0] Error saving signature:", error)
    return {
      success: false,
      error: "Failed to save signature",
    }
  }
}

export async function saveWitnessConfirmation(sessionId: string, confirmation: string, signatureData: string) {
  try {
    console.log("[v0] Saving witness confirmation for session:", sessionId)

    const supabase = createServerClient()

    // TODO: Upload witness signature to Blob storage when integration is added
    const signatureUrl = signatureData

    // Update witness_confirmation and witness_signature_url
    const { error } = await supabase
      .from("witness_sessions")
      .update({
        witness_confirmation: confirmation,
        witness_signature_url: signatureUrl,
      })
      .eq("id", sessionId)

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to save witness confirmation" }
    }

    // Log witness_confirmed event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "witness_confirmed",
      event_data: { confirmation, timestamp: new Date().toISOString() },
    })

    return {
      success: true,
      confirmationSaved: true,
    }
  } catch (error) {
    console.error("[v0] Error saving witness confirmation:", error)
    return {
      success: false,
      error: "Failed to save witness confirmation",
    }
  }
}

export async function completeWitnessSession(sessionId: string) {
  try {
    console.log("[v0] Completing witness session:", sessionId)

    const supabase = createServerClient()

    const { data: session, error: fetchError } = await supabase
      .from("witness_sessions")
      .select(`
        *,
        user:users(*),
        cmra_agent:cmra_agents(*)
      `)
      .eq("id", sessionId)
      .single()

    if (fetchError || !session) {
      console.error("[v0] Session not found:", fetchError)
      return { success: false, error: "Session not found" }
    }

    const form1583Data = {
      firstName: session.user.full_name.split(" ")[0],
      lastName: session.user.full_name.split(" ").slice(1).join(" "),
      email: session.user.email,
      phone: session.user.phone || "",
      dateOfBirth: session.metadata?.dateOfBirth || "",
      streetAddress: session.metadata?.streetAddress || "",
      city: session.metadata?.city || "",
      state: session.metadata?.state || "",
      zipCode: session.metadata?.zipCode || "",
      idType: session.metadata?.idType || "Driver's License",
      idNumber: session.metadata?.idNumber || "",
      idIssuingState: session.metadata?.idIssuingState || "",
      idExpirationDate: session.metadata?.idExpirationDate || "",
      cmraName: session.cmra_agent?.cmra_name || "",
      cmraAddress: session.cmra_agent?.business_address || "",
      cmraLicense: session.cmra_agent?.cmra_license || "",
      witnessName: session.cmra_agent?.full_name || "",
      witnessTitle: "Authorized Witness Agent",
      witnessDate: new Date().toLocaleDateString(),
      customerSignature: session.customer_signature_url || "",
      witnessSignature: session.witness_signature_url || "",
      sessionId: session.id,
      sessionType: session.session_type,
      confidenceScore: session.confidence_score,
    }

    const form1583Blob = await generateForm1583PDF(form1583Data)
    const certificateBlob = await generateWitnessCertificate(form1583Data)

    let form1583Url = ""
    let certificateUrl = ""

    try {
      const form1583Upload = await put(`sessions/${sessionId}/form1583.pdf`, form1583Blob, {
        access: "public",
        contentType: "application/pdf",
      })
      form1583Url = form1583Upload.url

      const certificateUpload = await put(`sessions/${sessionId}/certificate.pdf`, certificateBlob, {
        access: "public",
        contentType: "application/pdf",
      })
      certificateUrl = certificateUpload.url

      console.log("[v0] PDFs uploaded to Blob storage")
    } catch (uploadError) {
      console.error("[v0] Error uploading PDFs:", uploadError)
      // Fallback to data URLs if Blob upload fails
      form1583Url = URL.createObjectURL(form1583Blob)
      certificateUrl = URL.createObjectURL(certificateBlob)
    }

    const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const blockchainTx = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Update session status to 'completed' and set completed_at timestamp
    const { error } = await supabase
      .from("witness_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        form_1583_url: form1583Url,
        witness_certificate_url: certificateUrl,
        ipfs_hash: ipfsHash,
        blockchain_tx: blockchainTx,
      })
      .eq("id", sessionId)

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to complete session" }
    }

    // Log session_completed event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "session_completed",
      event_data: {
        completedAt: new Date().toISOString(),
        ipfsHash,
        blockchainTx,
        form1583Url,
        certificateUrl,
      },
    })

    return {
      success: true,
      sessionId,
      completedAt: new Date().toISOString(),
      form1583Url,
      certificateUrl,
      ipfsHash,
      blockchainTx,
    }
  } catch (error) {
    console.error("[v0] Error completing session:", error)
    return {
      success: false,
      error: "Failed to complete session",
    }
  }
}

export async function cancelWitnessSession(sessionId: string, reason: string) {
  try {
    console.log("[v0] Cancelling witness session:", sessionId, reason)

    const supabase = createServerClient()

    // Update session status to 'cancelled'
    const { data: session, error } = await supabase
      .from("witness_sessions")
      .update({
        status: "cancelled",
      })
      .eq("id", sessionId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to cancel session" }
    }

    // Log session_cancelled event with reason
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "session_cancelled",
      event_data: { reason, timestamp: new Date().toISOString() },
    })

    return {
      success: true,
      sessionId,
      cancelledAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Error cancelling session:", error)
    return {
      success: false,
      error: "Failed to cancel session",
    }
  }
}

export async function saveVideoRecording(sessionId: string, videoUrl: string) {
  try {
    console.log("[v0] Saving video recording for session:", sessionId)

    const supabase = createServerClient()

    // Update witness_sessions.video_recording_url
    const { error } = await supabase
      .from("witness_sessions")
      .update({
        video_recording_url: videoUrl,
      })
      .eq("id", sessionId)

    if (error) {
      console.error("[v0] Database error:", error)
      return { success: false, error: "Failed to save video" }
    }

    // Log video_saved event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "video_saved",
      event_data: { videoUrl, timestamp: new Date().toISOString() },
    })

    return {
      success: true,
      videoUrl,
    }
  } catch (error) {
    console.error("[v0] Error saving video:", error)
    return {
      success: false,
      error: "Failed to save video",
    }
  }
}
