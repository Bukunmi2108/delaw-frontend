import { LuImage, LuSendHorizontal } from 'react-icons/lu';
import { MdAttachFile } from 'react-icons/md';
import './InputBox.css';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  userPrompt: string
  setUserPrompt: Dispatch<SetStateAction<string>>
  onSendPrompt: () => void
  isTextAreaDisabled: boolean
  isStreaming: boolean
  setIsTextAreaDisabled: Dispatch<SetStateAction<boolean>>
}

const InputBox: React.FC<Props> = ({userPrompt, setUserPrompt, onSendPrompt, isTextAreaDisabled, setIsTextAreaDisabled, isStreaming }) => {

  const onSendButtonClicked = () => {
    onSendPrompt()
    setUserPrompt('');
  }
  const onEnterPress = (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      onSendButtonClicked()
    }
  };

  const onUserPromptChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserPrompt(ev.target.value);
    setIsTextAreaDisabled(ev.target.value.trim() === '');
  };


  return (
    <div className="input-box">
      <textarea
        aria-multiline
        className="input-field"
        placeholder="Ask CaseSimpli AI"
        onChange={onUserPromptChange}
        onKeyDown={onEnterPress}
        // disabled={isTextAreaDisabled}
        value={userPrompt}
        aria-label="Ask Delaw"
      />
      <div className="input-widgets">
        <div className="input-widgets-container">
          <span id="file-btn" className="icon" aria-label="Attach File">
            <MdAttachFile />
          </span>
          <span id="image-btn" className="icon" aria-label="Upload Image">
            <LuImage />
          </span>
        </div>
        <span
          id="send-btn"
          className="icon"
          onClick={onSendButtonClicked}
          style={{ cursor: isTextAreaDisabled || isStreaming ? 'not-allowed' : 'pointer', opacity: isTextAreaDisabled ? 0.5 : 1 }}
          aria-label="Send Message"
        >
          <LuSendHorizontal />
        </span>
      </div>
    </div>
  );
};

export default InputBox;