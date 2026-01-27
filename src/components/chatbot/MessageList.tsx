import { memo, type RefObject } from "react";
import type { ChatMessage } from "../../types/chat";
import { MenuCard } from "./MenuCard";

interface MessageListProps {
	messages: ChatMessage[];
	isLoading: boolean;
	bottomRef: RefObject<HTMLDivElement | null>;
}

export const MessageList = memo(({ messages, isLoading, bottomRef }: MessageListProps) => {
	return (
		<div className="chat-messages">
			{messages.map((message) => (
				<div key={message.id} className={`chat-message ${message.role}`}>
					{message.role === "user" ? (
						<div className="user-bubble">{message.content}</div>
					) : (
						<div className="assistant-content">
							{message.content && <div className="assistant-text">{message.content}</div>}

							{message.toolResults && message.toolResults.length > 0 && (
								<div className="menu-suggestions">
									{message.toolResults.map((items, idx) => (
										<div key={idx} className="menu-items">
											{items.map((item) => (
												<MenuCard key={item._id} item={item} />
											))}
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			))}

			{isLoading && (
				<div className="chat-message assistant">
					<div className="assistant-content">
						<div className="typing-indicator">
							<span />
							<span />
							<span />
						</div>
					</div>
				</div>
			)}
			<div ref={bottomRef} />
		</div>
	);
});

MessageList.displayName = "MessageList";
