import { mockDb } from "@/lib/data/mockDb";
import OrderClient from "./OrderClient";

export function generateStaticParams() {
  return mockDb.getOrders().map((order) => ({
    id: order.id,
  }));
}

export default function OrderTrackingPage() {
  return <OrderClient />;
}
