import type { Metadata } from 'next';
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Inventory, orders, abandoned cart metrics, and discount operations for SHEESHA HOOKAH.'
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
