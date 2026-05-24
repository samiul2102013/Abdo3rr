"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ChevronDown, Eye, Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { CustomerDetailsModal } from "@/components/dashboard/modals/CustomerDetailsModal";

interface Customer {
  id: number;
  name: string;
  image: string;
  email: string;
  phone: string;
  orders: number;
  status: "Active" | "Inactive";
}

const customersData: Customer[] = [
  { id: 1,  name: "Mohammed Al-Fahad",  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed", email: "fahad01@gmail.com",   phone: "+966 54 545 6677", orders: 12, status: "Active"   },
  { id: 2,  name: "Abdullah Al-Otaibi", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah", email: "otaibi02@gmail.com",  phone: "+966 50 112 3345", orders: 8,  status: "Active"   },
  { id: 3,  name: "Sara Al-Qahtani",    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",     email: "qahtani03@gmail.com", phone: "+966 55 223 4456", orders: 3,  status: "Active"   },
  { id: 4,  name: "Khalid Al-Harbi",    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid",   email: "harbi04@gmail.com",   phone: "+966 54 334 5567", orders: 4,  status: "Inactive" },
  { id: 5,  name: "Noura Al-Zahrani",   image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noura",    email: "zahrani05@gmail.com", phone: "+966 56 445 6678", orders: 5,  status: "Active"   },
  { id: 6,  name: "Faisal Al-Shammari", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faisal",   email: "shammari06@gmail.com",phone: "+966 50 556 7789", orders: 7,  status: "Active"   },
  { id: 7,  name: "Reem Al-Saud",       image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reem",     email: "alsaud07@gmail.com",  phone: "+966 53 667 8890", orders: 3,  status: "Active"   },
  { id: 8,  name: "Omar Al-Mutairi",    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",     email: "mutairi08@gmail.com", phone: "+966 55 778 9901", orders: 6,  status: "Inactive" },
  { id: 9,  name: "Huda Al-Ghamdi",     image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huda",     email: "ghamdi09@gmail.com",  phone: "+966 54 889 0012", orders: 5,  status: "Active"   },
  { id: 10, name: "Saud Al-Dosari",     image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saud",     email: "dosari10@gmail.com",  phone: "+966 50 990 1123", orders: 6,  status: "Active"   },
];

const ITEMS_PER_PAGE = 10;

// ── Edit Customer Modal ─────────────────────────────────────────────────────
function EditCustomerModal({ open, onOpenChange, customer, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  customer: Customer | null; onSave: (c: Customer) => void;
}) {
  const [name,   setName]   = useState(customer?.name   ?? "");
  const [email,  setEmail]  = useState(customer?.email  ?? "");
  const [phone,  setPhone]  = useState(customer?.phone  ?? "");
  const [status, setStatus] = useState<"Active" | "Inactive">(customer?.status ?? "Active");

  useMemo(() => {
    if (customer) {
      setName(customer.name); setEmail(customer.email);
      setPhone(customer.phone); setStatus(customer.status);
    }
  }, [customer]);

  const handleSave = () => {
    if (!customer || !name.trim()) return;
    onSave({ ...customer, name, email, phone, status });
    onOpenChange(false);
  };

  if (!customer) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Customer</DialogTitle>
          <p className="text-sm text-slate-400">Update customer information</p>
        </DialogHeader>

        {/* Avatar preview */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mt-4 mb-2">
          <img src={customer.image} alt={customer.name} className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
            <p className="text-xs text-slate-400">{customer.orders} orders</p>
          </div>
        </div>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "Active" | "Inactive")}>
              <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white" onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);
  const [customers, setCustomers]       = useState(customersData);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(
    () => customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [customers, search]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const paginated  = filtered.slice(start, start + ITEMS_PER_PAGE);

  const handleSave   = (updated: Customer) =>
    setCustomers((prev) => prev.map((c) => c.id === updated.id ? updated : c));
  const handleDelete = (id: number) =>
    setCustomers((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-400 mt-0.5">{customers.length} total customers</p>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 text-sm border-slate-200 bg-white" />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              {["Name", "Img", "Email", "Phone", "Orders", "Status", "Action"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-16 text-slate-400 text-sm">No customers found.</TableCell></TableRow>
            ) : paginated.map((customer) => (
              <TableRow key={customer.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-5 py-3.5 text-sm font-medium text-slate-700 whitespace-nowrap">{customer.name}</TableCell>
                <TableCell className="py-3.5">
                  <img src={customer.image} alt={customer.name} className="h-9 w-9 rounded-full object-cover bg-slate-100 ring-1 ring-slate-200" />
                </TableCell>
                <TableCell className="py-3.5 text-sm text-slate-500">{customer.email}</TableCell>
                <TableCell className="py-3.5 text-sm text-slate-500 whitespace-nowrap">{customer.phone}</TableCell>
                <TableCell className="py-3.5 text-sm font-medium text-slate-700">{customer.orders}</TableCell>
                <TableCell className="py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${customer.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none">
                      Action <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44 rounded-xl">
                      <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setViewCustomer(customer)}>
                        <Eye className="h-3.5 w-3.5 text-slate-400" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditCustomer(customer)}>
                        <Pencil className="h-3.5 w-3.5 text-slate-400" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm gap-2 cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleDelete(customer.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Showing {start + 1}–{Math.min(start + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 text-xs border-slate-200">Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="h-8 text-xs border-slate-200">Next</Button>
        </div>
      </div>

      <CustomerDetailsModal open={!!viewCustomer} onOpenChange={(v) => !v && setViewCustomer(null)} customer={viewCustomer} />
      <EditCustomerModal open={!!editCustomer} onOpenChange={(v) => !v && setEditCustomer(null)} customer={editCustomer} onSave={handleSave} />
    </div>
  );
}