import { memo, type RefObject } from "react";
import type { ChatMessage } from "../../types/chat";
import { MenuCard } from "./MenuCard";
import "./messageList.scss";

interface MessageListProps {
	messages: ChatMessage[];
	isLoading: boolean;
	bottomRef: RefObject<HTMLDivElement | null>;
	onResizeStart: (e: React.MouseEvent) => void;
}

export const MessageList = memo(({ messages, isLoading, bottomRef, onResizeStart }: MessageListProps) => {
	return (
		<div className="chatMessagesContainer">
			<span className="chatResizeHandle" onMouseDown={onResizeStart} />
			<div className="chatMessages">
				{messages.map((message) => (
					<div key={message.id} className={`chatMessage ${message.role}`}>
						{message.role === "user" ? (
							<div className="userBubble">{message.content}</div>
						) : (
							<div className="assistantContent">
								{message.content && <div className="assistantText">{message.content}</div>}

								{message.toolResults && message.toolResults.length > 0 && (
									<div className="menuSuggestions">
										{message.toolResults.map((items, idx) => (
											<div key={idx} className="menuItems">
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
					<div className="chatMessage assistant">
						<div className="assistantContent">
							<div className="typingIndicator">
								<span /> <span /> <span />
							</div>
						</div>
					</div>
				)}
				<div ref={bottomRef} />
			</div>
		</div>
	);
});

MessageList.displayName = "MessageList";
