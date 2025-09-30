"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, PhoneOff, User } from "lucide-react"
import { WebRTCClient } from "@/lib/video-call/webrtc-client"

interface VideoCallInterfaceProps {
  sessionId: string
  participantName: string
  participantRole: "customer" | "agent"
  onCallEnd?: () => void
}

export function VideoCallInterface({
  sessionId,
  participantName,
  participantRole,
  onCallEnd,
}: VideoCallInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const webrtcClientRef = useRef<WebRTCClient | null>(null)

  useEffect(() => {
    initializeCall()

    return () => {
      if (webrtcClientRef.current) {
        webrtcClientRef.current.disconnect()
      }
    }
  }, [])

  const initializeCall = async () => {
    try {
      setConnectionStatus("Accessing camera and microphone...")
      const client = new WebRTCClient()
      webrtcClientRef.current = client

      // Initialize local stream
      const localStream = await client.initializeLocalStream()

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream
      }

      setConnectionStatus("Connecting to peer...")

      // Create peer connection
      await client.createPeerConnection(
        (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
          setIsConnected(true)
          setConnectionStatus("Connected")
        },
        (candidate) => {
          // In production, send ICE candidate to signaling server
          console.log("[v0] ICE candidate:", candidate)
        },
      )

      // In production, exchange SDP offers/answers via signaling server
      // For demo, we'll simulate connection
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus("Connected")
      }, 2000)
    } catch (error) {
      console.error("[v0] Error initializing call:", error)
      setConnectionStatus("Connection failed")
    }
  }

  const toggleAudio = () => {
    if (webrtcClientRef.current) {
      const newState = !isAudioEnabled
      webrtcClientRef.current.toggleAudio(newState)
      setIsAudioEnabled(newState)
    }
  }

  const toggleVideo = () => {
    if (webrtcClientRef.current) {
      const newState = !isVideoEnabled
      webrtcClientRef.current.toggleVideo(newState)
      setIsVideoEnabled(newState)
    }
  }

  const endCall = () => {
    if (webrtcClientRef.current) {
      webrtcClientRef.current.disconnect()
    }
    setIsConnected(false)
    onCallEnd?.()
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <Badge variant={isConnected ? "default" : "secondary"} className="bg-green-600">
          {connectionStatus}
        </Badge>
        <div className="text-sm text-slate-600">Session: {sessionId.slice(0, 8)}</div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Video (You) */}
        <Card>
          <CardContent className="p-0 relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video bg-slate-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <User className="h-3 w-3" />
              You ({participantRole})
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 rounded-lg">
                <div className="text-center text-white">
                  <VideoOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera off</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Remote Video (Other Participant) */}
        <Card>
          <CardContent className="p-0 relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full aspect-video bg-slate-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <User className="h-3 w-3" />
              {participantName}
            </div>
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 rounded-lg">
                <div className="text-center text-white">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for {participantName}...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={toggleAudio}
          className={!isAudioEnabled ? "bg-red-50 border-red-200" : ""}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-red-600" />}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={toggleVideo}
          className={!isVideoEnabled ? "bg-red-50 border-red-200" : ""}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-red-600" />}
        </Button>

        <Button variant="destructive" size="lg" onClick={endCall} className="bg-red-600 hover:bg-red-700">
          <PhoneOff className="h-5 w-5 mr-2" />
          End Call
        </Button>
      </div>
    </div>
  )
}
