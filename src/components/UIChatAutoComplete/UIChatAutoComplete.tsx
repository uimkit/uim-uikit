import React, { useCallback } from 'react';

import { AutoCompleteTextarea } from '../AutoCompleteTextarea';
import { LoadingIndicator } from '../Loading/LoadingIndicator';

import { useMessageInputContext } from '../../context/MessageInputContext';
import { useComponentContext } from '../../context/ComponentContext';

import type { EmojiMartData } from '@emoji-mart/data';
import { SearchIndex } from 'emoji-mart';
import type { TriggerSettings } from '../UIMessageInput/DefaultTriggerProvider';

import type { CustomTrigger, DefaultStreamChatGenerics } from '../../types';
import { useTranslationContext } from '../../context';

type ObjectUnion<T> = T[keyof T];

export type SuggestionCommand<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = StreamChatGenerics/* CommandResponse<StreamChatGenerics>*/;

export type SuggestionUser<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = StreamChatGenerics; /* UserResponse<StreamChatGenerics>;*/;

export type SuggestionItemProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = {
  className: string;
  component: React.ComponentType<{
    entity: EmojiMartData | SuggestionUser<StreamChatGenerics> | SuggestionCommand<StreamChatGenerics>;
    selected: boolean;
  }>;
  item: EmojiMartData | SuggestionUser<StreamChatGenerics> | SuggestionCommand<StreamChatGenerics>;
  key: React.Key;
  onClickHandler: (event: React.BaseSyntheticEvent) => void;
  onSelectHandler: (
    item: EmojiMartData | SuggestionUser<StreamChatGenerics> | SuggestionCommand<StreamChatGenerics>,
  ) => void;
  selected: boolean;
  style: React.CSSProperties;
  value: string;
};

export interface SuggestionHeaderProps {
  currentTrigger: string;
  value: string;
}

export type SuggestionListProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = ObjectUnion<
  {
    [key in keyof TriggerSettings<StreamChatGenerics, V>]: {
      component: TriggerSettings<StreamChatGenerics, V>[key]['component'];
      currentTrigger: string;
      dropdownScroll: (element: HTMLDivElement) => void;
      getSelectedItem:
        | ((item: Parameters<TriggerSettings<StreamChatGenerics, V>[key]['output']>[0]) => void)
        | null;
      getTextToReplace: (
        item: Parameters<TriggerSettings<StreamChatGenerics, V>[key]['output']>[0],
      ) => {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
        key?: string;
      };
      Header: React.ComponentType<SuggestionHeaderProps>;
      onSelect: (newToken: {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
      }) => void;
      selectionEnd: number;
      SuggestionItem: React.ComponentType<SuggestionItemProps>;
      values: Parameters<
        Parameters<TriggerSettings<StreamChatGenerics, V>[key]['dataProvider']>[2]
      >[0];
      className?: string;
      itemClassName?: string;
      itemStyle?: React.CSSProperties;
      style?: React.CSSProperties;
      value?: string;
    };
  }
>;

export type UIChatAutoCompleteProps = {
  /** Function to override the default submit handler on the underlying `textarea` component */
  handleSubmit?: (event: React.BaseSyntheticEvent) => void;
  /** Function to run on blur of the underlying `textarea` component */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Function to override the default onChange behavior on the underlying `textarea` component */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /** Function to run on focus of the underlying `textarea` component */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Function to override the default onPaste behavior on the underlying `textarea` component */
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  /** Placeholder for the underlying `textarea` component */
  placeholder?: string;
  /** The initial number of rows for the underlying `textarea` component */
  rows?: number;
  /** The text value of the underlying `textarea` component */
  value?: string;
  /** Function to override the default emojiReplace behavior on the `wordReplace` prop of the `textarea` component */
  wordReplace?: (word: string) => string;
};

const UnMemoizedChatAutoComplete = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: UIChatAutoCompleteProps,
) => {
  const {
    AutocompleteSuggestionItem: SuggestionItem,
    AutocompleteSuggestionList: SuggestionList,
  } = useComponentContext<StreamChatGenerics, V>('ChatAutoComplete');
  const { t } = useTranslationContext('UIChatAutoComplete');

  const messageInput = useMessageInputContext/*<StreamChatGenerics, V>*/('ChatAutoComplete');
  const { disabled, textareaRef: innerRef } = messageInput;

  const placeholder = props.placeholder || t('Type your message');

  const emojiReplace = props.wordReplace
    ? (word: string) => props.wordReplace?.(word)
    : async (word: string) => {
        const found = (await SearchIndex.search(word)) ?? [];
        console.log('found: ', found);
        const emoji = found
          .filter(Boolean)
          .slice(0, 10)
          .find(({ emoticons }: EmojiData) => !!emoticons?.includes(word));
        if (!emoji || !('native' in emoji)) return null;
        return emoji.native;
      };

  const updateInnerRef = useCallback(
    (ref: HTMLTextAreaElement | null) => {
      if (innerRef) {
        innerRef.current = ref;
      }
    },
    [innerRef],
  );

  return (
    <AutoCompleteTextarea
      additionalTextareaProps={/*messageInput.additionalTextareaProps*/{}}
      aria-label={placeholder ?? 'placeholder'}
      className='uim-message-textarea'
      closeCommandsList={() => {}/*messageInput.closeCommandsList*/}
      closeMentionsList={() => {}/*messageInput.closeMentionsList*/}
      containerClassName='uim-textarea uim-message-textarea-react-host'
      disabled={disabled}
      disableMentions={false/*messageInput.disableMentions*/}
      dropdownClassName='uim-emojisearch'
      grow={false/*messageInput.grow*/}
      handleSubmit={props.handleSubmit || messageInput.handleSubmit}
      innerRef={updateInnerRef}
      itemClassName='uim-emojisearch__item'
      listClassName='uim-emojisearch__list'
      loadingComponent={LoadingIndicator}
      maxRows={3/*messageInput.maxRows*/}
      minChar={0}
      onBlur={props.onBlur}
      onChange={props.onChange || messageInput.handleChange}
      onFocus={props.onFocus}
      onPaste={props.onPaste/* TODO || messageInput.onPaste*/}
      placeholder={placeholder}
      replaceWord={emojiReplace}
      rows={props.rows || 3}
      shouldSubmit={() => false/*messageInput.shouldSubmit*/}
      showCommandsList={false/*messageInput.showCommandsList*/}
      showMentionsList={false/*messageInput.showMentionsList*/}
      SuggestionItem={SuggestionItem}
      SuggestionList={SuggestionList}
      trigger={messageInput.autocompleteTriggers || {}}
      value={props.value || messageInput.text}
    />
  );
};

export const UIChatAutoComplete = React.memo(
  UnMemoizedChatAutoComplete,
) as typeof UnMemoizedChatAutoComplete;