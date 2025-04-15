import { AnimatePresence } from "framer-motion";
import UserCard from "./UserCard";
import EmptyState from "./EmptyState";

const UserGrid = ({ 
  isLoading, 
  activeTab, 
  filteredRequests, 
  filteredUsers, 
  setSelectedRequest 
}) => {
  if (isLoading) return null;
  
  if (activeTab === "pending" && filteredRequests.length === 0) {
    return <EmptyState type="pending" />;
  }
  
  if (activeTab !== "pending" && filteredUsers.length === 0) {
    return <EmptyState type="filtered" />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      <AnimatePresence>
        {(activeTab === "pending" ? filteredRequests : filteredUsers).map((user) => (
          <UserCard 
            key={user._id}
            user={user}
            activeTab={activeTab}
            onClick={setSelectedRequest}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UserGrid;
