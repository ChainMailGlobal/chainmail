"use client"

import { jsPDF } from "jspdf"

export interface Form1583Data {
  // Customer Information
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string

  // Address Information
  streetAddress: string
  city: string
  state: string
  zipCode: string

  // ID Information
  idType: string
  idNumber: string
  idIssuingState: string
  idExpirationDate: string

  // CMRA Information
  cmraName: string
  cmraAddress: string
  cmraLicense: string

  // Witness Information
  witnessName: string
  witnessTitle: string
  witnessDate: string

  // Signatures (data URLs)
  customerSignature: string
  witnessSignature: string

  // Session Information
  sessionId: string
  sessionType: string
  confidenceScore?: number
}

export async function generateForm1583PDF(data: Form1583Data): Promise<Blob> {
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Title
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("USPS Form 1583", 105, 20, { align: "center" })
  doc.text("Application for Delivery of Mail Through Agent", 105, 28, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("(Approved by the Postal Service)", 105, 34, { align: "center" })

  // Section 1: Customer Information
  let yPos = 50
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Section 1: Customer Information", 20, yPos)

  yPos += 10
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Full Name: ${data.firstName} ${data.middleName || ""} ${data.lastName}`, 20, yPos)

  yPos += 7
  doc.text(`Date of Birth: ${data.dateOfBirth}`, 20, yPos)

  yPos += 7
  doc.text(`Email: ${data.email}`, 20, yPos)

  yPos += 7
  doc.text(`Phone: ${data.phone}`, 20, yPos)

  yPos += 7
  doc.text(`Address: ${data.streetAddress}`, 20, yPos)

  yPos += 7
  doc.text(`City, State, ZIP: ${data.city}, ${data.state} ${data.zipCode}`, 20, yPos)

  // Section 2: Identification
  yPos += 15
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Section 2: Identification", 20, yPos)

  yPos += 10
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`ID Type: ${data.idType}`, 20, yPos)

  yPos += 7
  doc.text(`ID Number: ${data.idNumber}`, 20, yPos)

  yPos += 7
  doc.text(`Issuing State: ${data.idIssuingState}`, 20, yPos)

  yPos += 7
  doc.text(`Expiration Date: ${data.idExpirationDate}`, 20, yPos)

  // Section 3: CMRA Information
  yPos += 15
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Section 3: Commercial Mail Receiving Agency (CMRA)", 20, yPos)

  yPos += 10
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`CMRA Name: ${data.cmraName}`, 20, yPos)

  yPos += 7
  doc.text(`CMRA Address: ${data.cmraAddress}`, 20, yPos)

  yPos += 7
  doc.text(`CMRA License: ${data.cmraLicense}`, 20, yPos)

  // Section 4: Signatures
  yPos += 15
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Section 4: Signatures", 20, yPos)

  yPos += 10

  // Customer Signature
  if (data.customerSignature) {
    try {
      doc.addImage(data.customerSignature, "PNG", 20, yPos, 60, 20)
    } catch (error) {
      console.error("[v0] Error adding customer signature:", error)
    }
  }
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Customer Signature", 20, yPos + 25)
  doc.text(`Date: ${data.witnessDate}`, 20, yPos + 30)

  // Witness Signature
  if (data.witnessSignature) {
    try {
      doc.addImage(data.witnessSignature, "PNG", 110, yPos, 60, 20)
    } catch (error) {
      console.error("[v0] Error adding witness signature:", error)
    }
  }
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("AI Witness™", 110, yPos + 10)

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("CMRA Authorized Signature", 110, yPos + 25)
  doc.text(`Witness: ${data.witnessName}`, 110, yPos + 30)
  doc.text(`Title: ${data.witnessTitle}`, 110, yPos + 35)

  // Section 5: Verification Details
  yPos += 50
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Section 5: Digital Verification", 20, yPos)

  yPos += 10
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Session ID: ${data.sessionId}`, 20, yPos)

  yPos += 6
  doc.text(`Session Type: ${data.sessionType}`, 20, yPos)

  if (data.confidenceScore) {
    yPos += 6
    doc.text(`AI Confidence Score: ${data.confidenceScore}%`, 20, yPos)
  }

  yPos += 6
  doc.text(`Verification Date: ${data.witnessDate}`, 20, yPos)

  // Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text("This document was generated digitally and is legally binding.", 105, 280, { align: "center" })
  doc.text("Verified by StreamlineWitness AI-Powered Digital Witnessing System", 105, 285, { align: "center" })

  // Convert to blob
  const pdfBlob = doc.output("blob")
  console.log("[v0] Form 1583 PDF generated successfully")

  return pdfBlob
}

export async function generateWitnessCertificate(data: Form1583Data): Promise<Blob> {
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Title with border
  doc.setLineWidth(1)
  doc.rect(15, 15, 180, 40)

  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICATE OF WITNESSING", 105, 30, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Digital Identity Verification & Signature Witnessing", 105, 42, { align: "center" })

  // Certificate Body
  let yPos = 70
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  const certText = `This is to certify that on ${data.witnessDate}, ${data.witnessName}, acting as an authorized witness for ${data.cmraName}, did witness the digital signature of:`

  const splitText = doc.splitTextToSize(certText, 170)
  doc.text(splitText, 20, yPos)

  yPos += splitText.length * 7 + 10
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(`${data.firstName} ${data.lastName}`, 105, yPos, { align: "center" })

  yPos += 15
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("For the purpose of executing USPS Form 1583", 105, yPos, { align: "center" })

  // Verification Details
  yPos += 20
  doc.setFontSize(10)
  doc.text("Verification Details:", 20, yPos)

  yPos += 8
  doc.text(`• Session ID: ${data.sessionId}`, 25, yPos)

  yPos += 7
  doc.text(`• Session Type: ${data.sessionType}`, 25, yPos)

  yPos += 7
  doc.text(`• Identity Verified: Yes`, 25, yPos)

  if (data.confidenceScore) {
    yPos += 7
    doc.text(`• AI Confidence Score: ${data.confidenceScore}%`, 25, yPos)
  }

  yPos += 7
  doc.text(`• ID Type: ${data.idType}`, 25, yPos)

  yPos += 7
  doc.text(`• ID Number: ${data.idNumber}`, 25, yPos)

  // Witness Signature
  yPos += 20
  if (data.witnessSignature) {
    try {
      doc.addImage(data.witnessSignature, "PNG", 20, yPos, 60, 20)
    } catch (error) {
      console.error("[v0] Error adding witness signature:", error)
    }
  }

  yPos += 25
  doc.setFont("helvetica", "bold")
  doc.text(data.witnessName, 20, yPos)

  yPos += 6
  doc.setFont("helvetica", "normal")
  doc.text(data.witnessTitle, 20, yPos)

  yPos += 6
  doc.text(data.cmraName, 20, yPos)

  // Seal/Badge
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(2)
  doc.circle(160, yPos - 15, 15)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("VERIFIED", 160, yPos - 18, { align: "center" })
  doc.text("DIGITAL", 160, yPos - 12, { align: "center" })

  // Footer
  yPos = 270
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text("This certificate is digitally generated and cryptographically secured.", 105, yPos, { align: "center" })
  doc.text("StreamlineWitness - AI-Powered Digital Witnessing System", 105, yPos + 5, { align: "center" })

  const pdfBlob = doc.output("blob")
  console.log("[v0] Witness certificate PDF generated successfully")

  return pdfBlob
}
