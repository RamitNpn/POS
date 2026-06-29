import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  CircleCheckBigIcon,
  Eye,
  Printer,
  RefreshCcw,
  SquareX,
  SquareXIcon,
  TicketCheckIcon,
} from "lucide-react";

import { formatDate, statusStyle } from "@/components/dashboard/admin/shared";
import { useUpdateTicketStatus } from "@/hooks/waiter/updateTicketStatus";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

interface Props {
  tickets: any[];
  onView: (ticket: any) => void;
  onPrint: (ticket: any) => void;
}

export function formatTimeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);

  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function TicketTable({ tickets, onView, onPrint }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const { mutate: markServed, isPending } = useUpdateTicketStatus();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticket #</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tickets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No tickets found for today
            </TableCell>
          </TableRow>
        ) : (
          tickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>#{ticket.ticketNumber}</TableCell>

              <TableCell>{ticket.orderNumber}</TableCell>

              <TableCell>{ticket.customerName}</TableCell>

              <TableCell>{ticket.table.tableName}</TableCell>

              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(
                    ticket.status,
                  )}`}
                >
                  {ticket.status}
                </span>
              </TableCell>

              <TableCell>
                {ticket.items.map((i: any) => (
                  <div key={i.menuItemId} className="text-xs">
                    {i.name} × {i.quantity}
                  </div>
                ))}
              </TableCell>

              <TableCell className="text-xs">
                <div>{formatTimeAgo(ticket.createdAt)}</div>
                <div className="text-[10px] text-muted-foreground">
                  {formatDate(ticket.createdAt)}
                </div>
              </TableCell>

              <TableCell>
                {user?.role === "waiter" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => onView(ticket)}
                          className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {ticket.status === "pending" && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={isPending}
                          onClick={() =>
                            markServed({
                              ticketID: ticket._id,
                              status: "served",
                            })
                          }
                          className="cursor-pointer text-white bg-green-700 hover:bg-green-600"
                        >
                          <CircleCheckBigIcon className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            markServed({
                              ticketID: ticket._id,
                              status: "cancelled",
                            })
                          }
                          className="cursor-pointer text-white bg-red-700 hover:bg-red-600"
                        >
                          <SquareX className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() =>
                        router.push(
                          `/dashboard/waiter/menu?tableId=${ticket.table.tableId}`,
                        )
                      }
                          className="cursor-pointer text-white bg-blue-700 hover:bg-blue-600"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : user?.role === "cashier" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onView(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onPrint(ticket)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
