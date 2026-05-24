"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Eye, EyeOff, MessageSquare, Mail, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/context/auth-context";

type Tab = "profile" | "notifications" | "security";

const TABS: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile Information" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
];

function NotificationRow({ icon: Icon, title, description, enabled, onToggle }: {
    icon: React.ElementType;
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#D13D3D]" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-700">{title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    enabled ? "bg-emerald-500" : "bg-slate-200"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}

function ProfileTab() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false, message: "", type: "success",
    });

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setPhone(user.phone ?? "");
            setAvatar(user.profile_picture ?? null);
        }
    }, [user]);

    useEffect(() => {
        if (toast.open) {
            const t = setTimeout(() => setToast((p) => ({ ...p, open: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [toast.open]);

    const handleSave = async () => {
        if (!phone.trim()) {
            setToast({ open: true, message: "Phone number is required.", type: "error" });
            return;
        }
        try {
            setSubmitting(true);
            const res = await authService.updateProfile({
                name: name.trim() || "",
                phone: phone.trim(),
                profile_picture: imageFile
            });
            if (res.success && res.data) {
                updateUser(res.data);
                setToast({ open: true, message: "Profile updated successfully!", type: "success" });
                setImageFile(null);
            } else {
                setToast({ open: true, message: res.message || "Failed to update profile.", type: "error" });
            }
        } catch (err: any) {
            setToast({ open: true, message: err?.message || "An error occurred.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Inline toast */}
            {toast.open && (
                <div className={`mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${
                    toast.type === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-red-50 border-red-100 text-red-600"
                }`}>
                    <span>{toast.type === "success" ? "✓" : "!"}</span>
                    {toast.message}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-800">Profile Information</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                    Update your account details and contact information.
                </p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-md">
                        {/* avatar image */}
                        <img
                            src={avatar || "/profile.png"}
                            alt="avatar"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/profile.png";
                            }}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={submitting}
                        className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#D13D3D] text-white flex items-center justify-center shadow-md hover:bg-[#b93333] transition-colors disabled:opacity-50"
                    >
                        <Camera className="h-3.5 w-3.5" />
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                                setImageFile(f);
                                setAvatar(URL.createObjectURL(f));
                            }
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">Name</Label>
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={submitting}
                        className="h-11 border-slate-200"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">Phone</Label>
                    <Input
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={submitting}
                        className="h-11 border-slate-200"
                    />
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={submitting}
                className="bg-[#D13D3D] hover:bg-[#b93333] text-white px-6"
            >
                {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </div>
    );
}

function NotificationsTab() {
    const [notifs, setNotifs] = useState([
        { id: 1, icon: MessageSquare, title: "New Order SMS", description: "Notify when a new high-value order is placed", enabled: true },
        { id: 2, icon: Mail, title: "SMS Alerts", description: "Immediate Alerts for guest messages", enabled: true },
        { id: 3, icon: Globe, title: "Platform Alerts", description: "Critical Sync and Channel Updates", enabled: true },
    ]);

    const toggle = (id: number) =>
        setNotifs((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, enabled: !n.enabled } : n
            )
        );

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-800">Notifications</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                    Control which alerts you receive and where.
                </p>
            </div>
            <div className="space-y-3">
                {notifs.map((n) => (
                    <NotificationRow
                        key={n.id}
                        icon={n.icon}
                        title={n.title}
                        description={n.description}
                        enabled={n.enabled}
                        onToggle={() => toggle(n.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function SecurityTab() {
    const [current,     setCurrent]     = useState("");
    const [newPass,     setNewPass]     = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting,  setSubmitting]  = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
        open: false, message: "", type: "success",
    });

    useEffect(() => {
        if (toast.open) {
            const t = setTimeout(() => setToast((p) => ({ ...p, open: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [toast.open]);

    const handleSave = async () => {
        if (!current || !newPass || !confirmPass) {
            setToast({ open: true, message: "Please fill in all fields.", type: "error" });
            return;
        }
        if (newPass !== confirmPass) {
            setToast({ open: true, message: "New passwords do not match.", type: "error" });
            return;
        }
        if (newPass.length < 8) {
            setToast({ open: true, message: "New password must be at least 8 characters.", type: "error" });
            return;
        }
        try {
            setSubmitting(true);
            const res = await authService.changePassword({ 
                old_password: current, 
                new_password: newPass,
                new_password2: confirmPass 
            });
            if (res.success) {
                setToast({ open: true, message: "Password changed successfully!", type: "success" });
                setCurrent(""); setNewPass(""); setConfirmPass("");
            } else {
                setToast({ open: true, message: res.message || "Failed to change password.", type: "error" });
            }
        } catch (err: any) {
            setToast({ open: true, message: err?.message || "An error occurred.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* Inline toast */}
            {toast.open && (
                <div className={`mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${
                    toast.type === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-red-50 border-red-100 text-red-600"
                }`}>
                    <span>{toast.type === "success" ? "✓" : "!"}</span>
                    {toast.message}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-800">Security</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                    Update your password to keep your account secure.
                </p>
            </div>

            <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">Current Password</Label>
                    <div className="relative">
                        <Input
                            type={showCurrent ? "text" : "password"}
                            placeholder="Enter your current password"
                            value={current}
                            onChange={(e) => setCurrent(e.target.value)}
                            disabled={submitting}
                            className="h-11 pr-10 border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">New Password</Label>
                    <div className="relative">
                        <Input
                            type={showNew ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            disabled={submitting}
                            className="h-11 pr-10 border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm text-slate-600">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your new password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            disabled={submitting}
                            className="h-11 pr-10 border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={submitting}
                className="bg-[#D13D3D] hover:bg-[#b93333] text-white px-6"
            >
                {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Manage your account preferences
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-start">
                <div className="w-full md:w-48 shrink-0">
                    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-2 flex flex-row md:flex-col gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 md:flex-none text-left px-3 py-2.5 rounded-xl text-sm transition-colors",
                                    activeTab === tab.id
                                        ? "bg-[#D13D3D] text-white font-medium"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "notifications" && <NotificationsTab />}
                    {activeTab === "security" && <SecurityTab />}
                </div>
            </div>
        </div>
    );
}