import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import customerService from '../services/customer.service';
import { apiErrorMessage } from '../services/api';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AccountProfile() {
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ addressLine1: '', city: '', country: '' });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) reset({ firstName: user.first_name, lastName: user.last_name, phone: user.phone || '' });
    customerService.me().then((data) => setAddresses(data.addresses || []));
  }, [user, reset]);

  const onSubmit = async (values) => {
    setSaving(true); setError(''); setSuccess(false);
    try {
      await customerService.updateProfile(values);
      await refresh();
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addAddress = async () => {
    try {
      await customerService.addAddress(newAddress);
      const data = await customerService.me();
      setAddresses(data.addresses || []);
      setNewAddress({ addressLine1: '', city: '', country: '' });
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const removeAddress = async (id) => {
    await customerService.removeAddress(id);
    const data = await customerService.me();
    setAddresses(data.addresses || []);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-brand-800/10 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">Profile</h2>
        {success && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Profile updated</div>}
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" {...register('firstName')} />
            <Input label="Last name" {...register('lastName')} />
          </div>
          <Input label="Phone" {...register('phone')} />
          <Button type="submit" disabled={saving}>Save changes</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-brand-800/10 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-semibold text-ink">Addresses</h2>
        <div className="mb-4 flex flex-col gap-2">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-brand-800/10 p-3">
              <p className="text-sm text-ink/80">{a.address_line1}, {a.city}, {a.country}</p>
              <button onClick={() => removeAddress(a.id)} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input placeholder="Address" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} className="sm:col-span-2" />
          <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addAddress}>Add address</Button>
      </div>
    </div>
  );
}
