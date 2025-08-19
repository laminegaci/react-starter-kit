import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  avatar: File | string | null;
};

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  const { 
    data,
    setData,
    post,            // <- use post instead of patch
    errors,
    processing,
    recentlySuccessful,
    progress,
    transform, 
  } =
    useForm<ProfileForm>({
      first_name: auth.user.profile?.first_name ?? '',
      last_name: auth.user.profile?.last_name ?? '',
      email: auth.user.email,
      avatar: auth.user.profile?.avatar?.original ?? null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
        preserveScroll: true,
        onSuccess: success,
        onError: failed
        });
    };

    const success = () => {
        toast.success("Profile updated successfully!");
    }
    const failed = (errors: Record<string, string>) => {
        console.log(errors)
        toast.error("Failed updated profile. Please try again." + JSON.stringify(errors));
    }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile information"
            description="Update your first name and email address"
          />

          <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
            <input
                id="avatar"
                type="file"
                accept="image/*"
                className="file-input cursor-pointer"
                ref={fileInputRef}
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setData("avatar", file);

                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    } else {
                      setPreview(null);
                    }
                  }}
                  hidden
            />
            <div className="mt-4 flex items-center gap-4">
  {/* Avatar preview with clickable area */}
  <div
    className="relative h-20 w-20"
    onClick={() => fileInputRef.current?.click()}
  >
    <img
      src={preview ?? (data.avatar as string)}
      alt="Avatar preview"
      className="h-20 w-20 rounded-full object-cover border border-gray-300 shadow-sm cursor-pointer hover:opacity-80 transition"
    />

    {/* Hover overlay */}
    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition">
      <span className="text-white text-xs">Change</span>
    </div>

    {/* Upload progress ring */}
    {progress && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="radial-progress text-indigo-500"
          style={
            { "--value": progress.percentage } as React.CSSProperties
          }
          role="progressbar"
        >
          <span className="text-xs text-gray-700">
            {progress.percentage}%
          </span>
        </div>
      </div>
    )}
  </div>

  {/* Remove button */}
  {(preview || data.avatar) && (
    <button
      type="button"
      onClick={() => {
        setData("avatar", null);
        setPreview(null);
      }}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Remove
    </button>
  )}
</div>


            <InputError className="mt-2" message={errors.avatar} />
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="first_name">First name</Label>

              <Input
                id="first_name"
                className="mt-1 block w-full"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                required
                autoComplete="given-name"
                placeholder="First name"
              />

              <InputError className="mt-2" message={errors.first_name} />
            </div>
            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="last_name">First name</Label>

              <Input
                id="last_name"
                className="mt-1 block w-full"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                required
                autoComplete="given-name"
                placeholder="First name"
              />

              <InputError className="mt-2" message={errors.last_name} />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
                placeholder="Email address"
              />

              <InputError className="mt-2" message={errors.email} />
            </div>


            {/* Actions */}
            <div className="flex items-center gap-4">
            <button
                type="submit"
                className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-orange-400 cursor-pointer ${processing ? 'bg-indigo-300! hover:bg-indigo-400!' : ''}`}
                disabled={processing}
                >
                {processing && (
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                )}
                Save Changes
            </button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
