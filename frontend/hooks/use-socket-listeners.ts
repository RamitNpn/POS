import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Track if listeners have been attached globally (not per component)
let listenersAttached = false;

export const useSocketListeners = () => {
  const queryClient = useQueryClient();
  const listenersSetupRef = useRef(false);
  
  // Invalidate queries by matching the first segment of the query key.
  const invalidateByKey = (key: string) => {
    queryClient.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === key,
    });
  };

  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ Socket not initialized");
      return;
    }

    // If listeners are already attached globally, don't attach again
    if (listenersAttached || listenersSetupRef.current) {
      console.log("ℹ️ Socket listeners already attached, skipping...");
      return;
    }

    console.log("📡 Setting up socket listeners... Socket connected?", socket.connected);
    
    if (!socket.connected) {
      console.warn("⚠️ Socket not connected yet. Listeners will work when connected...");
    }

    listenersSetupRef.current = true;
    listenersAttached = true;

    const onOrderCreated = (data: any) => {
      console.log("✅ Socket received: order:created", data);
      toast.success("New order received");
      invalidateByKey("orders");
      invalidateByKey("active-orders");
      invalidateByKey("table-stats");
    };

    const onOrderUpdated = (data: any) => {
      console.log("✅ Socket received: order:updated", data);
      toast.success("Order updated");
      invalidateByKey("orders");
      invalidateByKey("active-orders");
      invalidateByKey("completed-orders");
      invalidateByKey("table-stats");
    };

    const onTicketCreated = (data: any) => {
      console.log("✅ Socket received: ticket:created", data);
      toast("New kitchen ticket created");
      invalidateByKey("kitchen-orders");
      invalidateByKey("kitchen-history");
    };

    const onTicketUpdated = (data: any) => {
      console.log("✅ Socket received: ticket:updated", data);
      toast("Kitchen ticket updated");
      invalidateByKey("kitchen-orders");
      invalidateByKey("kitchen-history");
    };

    const onReservationCreated = (data: any) => {
      console.log("✅ Socket received: reservation:created", data);
      toast.success("New reservation created");
      invalidateByKey("reservations");
    };

    const onReservationUpdated = (data: any) => {
      console.log("✅ Socket received: reservation:updated", data);
      toast("Reservation updated");
      invalidateByKey("reservations");
    };

    const onReservationDeleted = (data: any) => {
      console.log("✅ Socket received: reservation:deleted", data);
      toast("Reservation deleted");
      invalidateByKey("reservations");
    };

    const onTableUpdated = (data: any) => {
      console.log("✅ Socket received: table:updated", data);
      toast("Table updated");
      invalidateByKey("tables");
      invalidateByKey("table-stats");
    };

    const onRoomUpdated = (data: any) => {
      console.log("✅ Socket received: room:updated", data);
      invalidateByKey("rooms");
    };

    const onMenuCategoryUpdated = (data: any) => {
      console.log("✅ Socket received: menu-category:updated", data);
      invalidateByKey("menu-categories");
    };

    const onMenuSubCategoryUpdated = (data: any) => {
      console.log("✅ Socket received: menu-subcategory:updated", data);
      invalidateByKey("menu-subcategories");
    };

    const onMenuItemUpdated = (data: any) => {
      console.log("✅ Socket received: menu-item:updated", data);
      invalidateByKey("menu-items");
    };

    // Attach all listeners
    socket.on("order:created", onOrderCreated);
    socket.on("order:updated", onOrderUpdated);
    socket.on("ticket:created", onTicketCreated);
    socket.on("ticket:updated", onTicketUpdated);
    socket.on("reservation:created", onReservationCreated);
    socket.on("reservation:updated", onReservationUpdated);
    socket.on("reservation:deleted", onReservationDeleted);
    socket.on("table:updated", onTableUpdated);
    socket.on("room:updated", onRoomUpdated);
    socket.on("menu-category:updated", onMenuCategoryUpdated);
    socket.on("menu-subcategory:updated", onMenuSubCategoryUpdated);
    socket.on("menu-item:updated", onMenuItemUpdated);

    console.log("✅ All socket listeners attached successfully!");

    return () => {
      // Don't detach listeners on cleanup - they should persist
      console.log("ℹ️ SocketProvider unmounting but keeping listeners active");
    };
  }, []);
};

export default useSocketListeners;
