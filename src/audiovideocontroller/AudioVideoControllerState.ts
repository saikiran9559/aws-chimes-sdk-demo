// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AudioMixController from '../audiomixcontroller/AudioMixController';
import AudioProfile from '../audioprofile/AudioProfile';
import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import ExtendedBrowserBehavior from '../browserbehavior/ExtendedBrowserBehavior';
import ConnectionMonitor from '../connectionmonitor/ConnectionMonitor';
import EventController from '../eventcontroller/EventController';
import Logger from '../logger/Logger';
import MediaStreamBroker from '../mediastreambroker/MediaStreamBroker';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import MeetingSessionTURNCredentials from '../meetingsession/MeetingSessionTURNCredentials';
import MeetingSessionVideoAvailability from '../meetingsession/MeetingSessionVideoAvailability';
import RealtimeController from '../realtimecontroller/RealtimeController';
import ReconnectController from '../reconnectcontroller/ReconnectController';
import RemovableObserver from '../removableobserver/RemovableObserver';
import SDP from '../sdp/SDP';
import VideoCodecCapability from '../sdp/VideoCodecCapability';
import SignalingClient from '../signalingclient/SignalingClient';
import { SdkIndexFrame, SdkStreamServiceType } from '../signalingprotocol/SignalingProtocol.js';
import StatsCollector from '../statscollector/StatsCollector';
import TransceiverController from '../transceivercontroller/TransceiverController';
import VideoCaptureAndEncodeParameter from '../videocaptureandencodeparameter/VideoCaptureAndEncodeParameter';
import VideoDownlinkBandwidthPolicy from '../videodownlinkbandwidthpolicy/VideoDownlinkBandwidthPolicy';
import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';
import VolumeIndicatorAdapter from '../volumeindicatoradapter/VolumeIndicatorAdapter';

/**
 * [[AudioVideoControllerState]] includes the compute resources shared by [[Task]].
 */
export default class AudioVideoControllerState {
  logger: Logger | null = null;

  browserBehavior: ExtendedBrowserBehavior | null = null;

  signalingClient: SignalingClient | null = null;

  meetingSessionConfiguration: MeetingSessionConfiguration | null = null;

  peer: RTCPeerConnection | null = null;

  previousSdpOffer: SDP | null = null;

  sdpOfferInit: RTCSessionDescriptionInit | null = null;

  audioVideoController: AudioVideoController | null = null;

  realtimeController: RealtimeController | null = null;

  videoTileController: VideoTileController | null = null;

  mediaStreamBroker: MediaStreamBroker | null = null;

  audioMixController: AudioMixController | null = null;

  activeAudioInput: MediaStream | undefined = undefined;

  activeVideoInput: MediaStream | undefined = undefined;

  transceiverController: TransceiverController | null = null;

  indexFrame: SdkIndexFrame | null = null;

  iceCandidates: RTCIceCandidate[] = [];

  iceCandidateHandler: ((event: RTCPeerConnectionIceEvent) => void) | null = null;

  iceGatheringStateEventHandler: (() => void) | null = null;

  sdpAnswer: string | null = null;

  turnCredentials: MeetingSessionTURNCredentials | null = null;

  reconnectController: ReconnectController | null = null;

  removableObservers: RemovableObserver[] = [];

  audioProfile: AudioProfile | null = null;

  videoStreamIndex: VideoStreamIndex | null = null;

  videoDownlinkBandwidthPolicy: VideoDownlinkBandwidthPolicy | null = null;

  videoUplinkBandwidthPolicy: VideoUplinkBandwidthPolicy | null = null;

  lastKnownVideoAvailability: MeetingSessionVideoAvailability | null = null;

  videoCaptureAndEncodeParameter: VideoCaptureAndEncodeParameter | null = null;

  // An unordered list of IDs provided by the downlink policy that
  // we will eventually subscribe to.
  videosToReceive: VideoStreamIdSet | null = null;

  // The last processed set of IDs provided by the policy, so that we can
  // compare what changes were additions, stream switches, or removals.
  lastVideosToReceive: VideoStreamIdSet | null = null;

  // An ordered list corresponding to `videosToReceive` where the order
  // itself correspond to transceivers; 0 in this list corresponds to an inactive tranceiver.
  videoSubscriptions: number[] | null = null;

  // The video subscription limit is set by the backend and is subject to change in future.
  // This value is set in the `JoinAndReceiveIndexTask` when we process the `SdkJoinAckFrame`
  // and is used in the `ReceiveVideoStreamIndexTask` to limit the total number of streams
  // that we include in the `videosToReceive`.
  videoSubscriptionLimit: number = 25;

  // The previous SDP answer will be used as a dictionary to seed the compression library
  // during decompressing the compressed SDP answer.
  previousSdpAnswerAsString: string = '';

  // This flag indicates if the backend supports compression for the client.
  serverSupportsCompression: boolean = false;

  // Values set by `setVideoCodecSendPreferences`.
  videoSendCodecPreferences: VideoCodecCapability[] = [];

  // Calculated as the highest priority available codec set in the (possibly munged) SDP answer
  // that is provide to the peer connection, which will be what is sent.
  currentVideoSendCodec: VideoCodecCapability;

  // Intersection of `videoSendCodecPreferences` and the supported receive codecs of
  // all the other clients in the meeting.
  meetingSupportedVideoSendCodecPreferences: VideoCodecCapability[] | undefined = undefined;

  videosPaused: VideoStreamIdSet | null = null;

  videoDuplexMode: SdkStreamServiceType | null = null;

  volumeIndicatorAdapter: VolumeIndicatorAdapter | null = null;

  statsCollector: StatsCollector | null = null;

  connectionMonitor: ConnectionMonitor | null = null;

  videoInputAttachedTimestampMs: number = 0;

  audioDeviceInformation: { [id: string]: string } = {};

  videoDeviceInformation: { [id: string]: string } = {};

  enableSimulcast: boolean = false;

  eventController: EventController | null = null;

  signalingOpenDurationMs: number | null = null;

  iceGatheringDurationMs: number | null = null;

  startAudioVideoTimestamp: number | null = null;

  attendeePresenceDurationMs: number | null = null;

  meetingStartDurationMs: number | null = null;

  poorConnectionCount: number = 0;

  maxVideoTileCount: number = 0;

  startTimeMs: number | null = null;
}
