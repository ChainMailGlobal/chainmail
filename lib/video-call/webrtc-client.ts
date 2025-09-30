"use client"

// WebRTC client for peer-to-peer video calls between customer and CMRA agent

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

export interface CallParticipant {
  id: string
  name: string
  role: "customer" | "agent"
}

export class WebRTCClient {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private config: WebRTCConfig

  constructor(config?: WebRTCConfig) {
    this.config = config || {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }
  }

  async initializeLocalStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        constraints || {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        },
      )

      this.localStream = stream
      console.log("[v0] Local stream initialized")
      return stream
    } catch (error) {
      console.error("[v0] Error accessing media devices:", error)
      throw new Error("Failed to access camera/microphone")
    }
  }

  async createPeerConnection(
    onRemoteStream: (stream: MediaStream) => void,
    onIceCandidate: (candidate: RTCIceCandidate) => void,
  ): Promise<RTCPeerConnection> {
    this.peerConnection = new RTCPeerConnection(this.config)

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log("[v0] Received remote track")
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
      }
      this.remoteStream.addTrack(event.track)
      onRemoteStream(this.remoteStream)
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[v0] New ICE candidate")
        onIceCandidate(event.candidate)
      }
    }

    // Connection state monitoring
    this.peerConnection.onconnectionstatechange = () => {
      console.log("[v0] Connection state:", this.peerConnection?.connectionState)
    }

    return this.peerConnection
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    console.log("[v0] Created offer")
    return offer
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    console.log("[v0] Created answer")
    return answer
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description))
    console.log("[v0] Set remote description")
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    console.log("[v0] Added ICE candidate")
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
      console.log("[v0] Audio", enabled ? "enabled" : "disabled")
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
      console.log("[v0] Video", enabled ? "enabled" : "disabled")
    }
  }

  disconnect(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    this.remoteStream = null
    console.log("[v0] WebRTC connection closed")
  }

  getLocalStream(): MediaStream | null {
    return this.localStream
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream
  }
}
