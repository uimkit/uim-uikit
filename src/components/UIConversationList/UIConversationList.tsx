import { useChatActionContext, useUIKit } from "../../context";
import { UIConversationListView } from "./UIConversationListView";
import { UIConversationListHeader } from "../UIConversationListHeader";
import { useConversationList } from "../../hooks/useConversationList";
import './styles/index.scss';

export function UIConversationList() {
  const { activeProfile, activeConversation, setActiveConversation } = useUIKit();
  const { loadMoreConversations } = useChatActionContext();

  const { conversations } = useConversationList(activeProfile?.id);

  return (
    <div className="uim-conversation">
      <UIConversationListHeader />
      <UIConversationListView 
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        conversations={conversations} 
        loadMore={() => loadMoreConversations(activeProfile?.id)}
      />
    </div>
  );
}