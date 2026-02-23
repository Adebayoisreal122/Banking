import React, { useState, useRef } from "react";
import {
  User, Lock, Bell, Shield, CheckCircle, Eye, EyeOff,
  Camera, Mail, Phone, AlertCircle, Upload, X, Loader,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";

type Tab = "profile" | "security" | "notifications";

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Profile state ──
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Avatar state ──
  const [avatarPreview, setAvatarPreview] = useState<any>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Password state ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Notification state ──
  const [notifications, setNotifications] = useState({
    emailTransactions: true, emailLoans: true, emailMarketing: false,
    smsTransactions: true, smsAlerts: true,
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg); setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };
  const showError = (msg: string) => {
    setErrorMsg(msg); setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 5000);
  };

  // ── Avatar handlers ──
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      return showError("Please select an image file (JPG, PNG, WEBP)");
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return showError("Image must be smaller than 5MB");
    }

    setAvatarFile(file);
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const result = await authAPI.uploadAvatar(formData);
      // result.avatarUrl is the URL saved in DB and returned by backend
      updateUser({ avatar: result.avatarUrl });
      setAvatarFile(null); // clear pending file — preview stays from URL
      setAvatarPreview(result.avatarUrl);
      showSuccess("Profile photo updated!");
    } catch (err: any) {
      showError(err.response?.data?.error || "Photo upload failed.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return showError("Full name is required");
    setProfileLoading(true);
    try {
      const updated = await authAPI.updateProfile({ fullName, email, phone });
      updateUser({ fullName: updated.fullName, email: updated.email, phone: updated.phone });
      showSuccess("Profile updated successfully!");
    } catch (err: any) {
      showError(err.response?.data?.error || "Profile update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return showError("Current password is required");
    if (newPassword.length < 8) return showError("New password must be at least 8 characters");
    if (newPassword !== confirmPassword) return showError("Passwords do not match");
    setPasswordLoading(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      showSuccess("Password changed successfully!");
    } catch (err: any) {
      showError(err.response?.data?.error || "Password change failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      showSuccess("Notification preferences saved!");
    } catch { showError("Failed to save preferences."); }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",       label: "Profile",       icon: <User className="h-4 w-4" /> },
    { id: "security",      label: "Security",      icon: <Lock className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ];

  const PasswordInput = ({ label, value, onChange, show, setShow, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; setShow: (v: boolean) => void; placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "••••••••"}
          className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }: {
    label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-blue-600" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      {successMsg && (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" /><span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /><span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              {tab.icon}<span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-5">

              {/* ── Avatar Section ── */}
              <div className="pb-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Profile Photo</p>
                <div className="flex items-center space-x-5">
                  {/* Avatar circle */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                          <span className="text-white font-bold text-3xl">
                            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Camera overlay button */}
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute -bottom-1.5 -right-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2 shadow-md transition"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Upload controls */}
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    {/* Show upload/remove buttons only when a new file is selected */}
                    {avatarFile ? (
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAvatarUpload}
                          disabled={avatarUploading}
                          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                          {avatarUploading
                            ? <><Loader className="h-3.5 w-3.5 animate-spin" /><span>Uploading...</span></>
                            : <><Upload className="h-3.5 w-3.5" /><span>Upload Photo</span></>
                          }
                        </button>
                        <button
                          type="button"
                          onClick={handleAvatarRemove}
                          className="flex items-center space-x-1.5 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>
                        <span className="text-xs text-gray-400 truncate max-w-[120px]">{avatarFile.name}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="flex items-center space-x-1.5 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-4 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>Change Photo</span>
                      </button>
                    )}
                    <p className="text-xs text-gray-400">JPG, PNG or WEBP · Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* ── Profile Fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="+234 800 000 0000" />
                  </div>
                </div>
              </div>

              {/* Account info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Info</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Account Status</span>
                  <span className="font-medium text-green-600 flex items-center space-x-1"><CheckCircle className="h-3.5 w-3.5" /><span>Active</span></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium text-gray-700">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long" }) : "2024"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verification</span>
                  <span className="font-medium text-blue-600 flex items-center space-x-1"><Shield className="h-3.5 w-3.5" /><span>CBN Verified</span></span>
                </div>
              </div>

              <button type="submit" disabled={profileLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-blue-100">
                {profileLoading ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* ── Security Tab ── */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Change Password</h3>
                  <p className="text-sm text-gray-400">Use a strong password with at least 8 characters.</p>
                </div>
                <PasswordInput label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={showCurrent} setShow={setShowCurrent} placeholder="Enter current password" />
                <PasswordInput label="New Password" value={newPassword} onChange={setNewPassword} show={showNew} setShow={setShowNew} placeholder="Min. 8 characters" />
                <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} show={showConfirm} setShow={setShowConfirm} placeholder="Repeat new password" />
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`flex-1 h-1.5 rounded-full transition-all ${
                          newPassword.length >= level * 3
                            ? level <= 1 ? "bg-red-400" : level <= 2 ? "bg-orange-400" : level <= 3 ? "bg-yellow-400" : "bg-green-500"
                            : "bg-gray-200"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {newPassword.length < 6 ? "Weak" : newPassword.length < 9 ? "Fair" : newPassword.length < 12 ? "Good" : "Strong"} password
                    </p>
                  </div>
                )}
                <button type="submit" disabled={passwordLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-sm hover:shadow-md">
                  {passwordLoading ? "Updating Password..." : "Update Password"}
                </button>
              </form>

              <div className="border-t border-gray-100 pt-5 space-y-3">
                <h3 className="text-base font-semibold text-gray-900">Security Overview</h3>
                {[
                  { label: "Two-Factor Authentication", status: "Not enabled", statusColor: "text-orange-500", action: "Enable" },
                  { label: "Login Alerts",              status: "Active",       statusColor: "text-green-600",  action: "Manage" },
                  { label: "Session Timeout",           status: "30 minutes",   statusColor: "text-gray-500",   action: "Change" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border border-gray-100 rounded-xl px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className={`text-xs mt-0.5 ${item.statusColor}`}>{item.status}</p>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Email Notifications</h3>
                <div className="bg-gray-50 rounded-xl px-4">
                  <Toggle label="Transaction Alerts" description="Get notified for every debit and credit" checked={notifications.emailTransactions} onChange={(v) => setNotifications({ ...notifications, emailTransactions: v })} />
                  <Toggle label="Loan Updates" description="Repayment reminders and loan status changes" checked={notifications.emailLoans} onChange={(v) => setNotifications({ ...notifications, emailLoans: v })} />
                  <Toggle label="Marketing & Offers" description="Product updates and special promotions" checked={notifications.emailMarketing} onChange={(v) => setNotifications({ ...notifications, emailMarketing: v })} />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">SMS Notifications</h3>
                <div className="bg-gray-50 rounded-xl px-4">
                  <Toggle label="Transaction SMS" description="Instant SMS for all transactions" checked={notifications.smsTransactions} onChange={(v) => setNotifications({ ...notifications, smsTransactions: v })} />
                  <Toggle label="Security Alerts" description="Login attempts and suspicious activity" checked={notifications.smsAlerts} onChange={(v) => setNotifications({ ...notifications, smsAlerts: v })} />
                </div>
              </div>
              <button onClick={handleNotificationSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md">
                Save Preferences
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}