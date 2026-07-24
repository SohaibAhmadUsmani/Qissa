import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { addressService } from '../../services/addressService';

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  streetAddress: '',
  city: '',
  provinceState: '',
  postalCode: '',
  country: 'Pakistan',
  landmark: '',
  addressType: 'Home',
  isDefault: false,
};

export default function AddressModal({ address, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName || '',
        phone: address.phone || '',
        streetAddress: address.streetAddress || '',
        city: address.city || '',
        provinceState: address.provinceState || '',
        postalCode: address.postalCode || '',
        country: address.country || 'Pakistan',
        landmark: address.landmark || '',
        addressType: address.addressType || 'Home',
        isDefault: address.isDefault || false,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, phone, streetAddress, city, provinceState, postalCode, country } = form;
    if (!fullName || !phone || !streetAddress || !city || !provinceState || !postalCode || !country) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setSaving(true);
      if (address) {
        await addressService.updateAddress(address._id, form);
        toast.success('Address updated');
      } else {
        await addressService.createAddress(form);
        toast.success('Address added');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <h3>{address ? 'Edit Address' : 'Add New Address'}</h3>
          <button type="button" className="address-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="address-modal-form" onSubmit={handleSubmit}>
          <div className="address-modal-grid">
            <div className="address-modal-field full">
              <label>Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
            </div>
            <div className="address-modal-field full">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
            </div>
            <div className="address-modal-field full">
              <label>Street Address *</label>
              <input name="streetAddress" value={form.streetAddress} onChange={handleChange} placeholder="House #, Street, Area" />
            </div>
            <div className="address-modal-field">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
            </div>
            <div className="address-modal-field">
              <label>Province *</label>
              <input name="provinceState" value={form.provinceState} onChange={handleChange} placeholder="Province" />
            </div>
            <div className="address-modal-field">
              <label>Postal Code *</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" />
            </div>
            <div className="address-modal-field">
              <label>Country *</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
            </div>
            <div className="address-modal-field">
              <label>Landmark</label>
              <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near..." />
            </div>
            <div className="address-modal-field half">
              <label>Address Type</label>
              <select name="addressType" value={form.addressType} onChange={handleChange}>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="address-modal-field half checkbox-field">
              <label>
                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                Set as default address
              </label>
            </div>
          </div>

          <div className="address-modal-actions">
            <button type="button" className="address-modal-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="address-modal-btn primary" disabled={saving}>
              {saving ? <><Loader size={14} className="spin" /> Saving...</> : (address ? 'Update Address' : 'Add Address')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
