import { Message, MessageType } from '../../../types';
import {
  handleAudioMessageShowContext,
  handleCustomMessageShowContext,
  handleFaceMessageShowContext,
  handleFileMessageShowContext,
  handleImageMessageShowContext,
  handleLocationMessageShowContext,
  handleMergerMessageShowContext,
  handleTextMessageShowContext,
  handleTipMessageShowContext,
  handleVideoMessageShowContext,
  translateGroupSystemNotice,
} from '../utils';

interface messageContextParams {
  message?: Message,
}

export const useMessageContextHandler = <T extends messageContextParams>(params:T) => {
  const {
    message,
  } = params;
  let context;
  if (message) {
    switch (message?.type) {
      case MessageType.Text:
        context = handleTextMessageShowContext(message);
        break;
      case MessageType.Face:
        context = handleFaceMessageShowContext(message);
        break;
      case MessageType.Image:
        context = handleImageMessageShowContext(message);
        break;
      case MessageType.Voice:
        context = handleAudioMessageShowContext(message);
        break;
      case MessageType.Video:
        context = handleVideoMessageShowContext(message);
        break;
      case MessageType.File:
        context = handleFileMessageShowContext(message);
        break;
      case MessageType.Custom:
        context = handleCustomMessageShowContext(message);
        break;
      case MessageType.Merger:
        context = handleMergerMessageShowContext(message);
        break;
      case MessageType.Location:
        context = handleLocationMessageShowContext(message);
        break;
      case MessageType.GroupTip:
        context = handleTipMessageShowContext(message);
        break;
      case MessageType.GroupSystemNotice:
        context = translateGroupSystemNotice(message);
        break;

      default:
        break;
    }
  }

  return {
    context,
    message,
  };
};