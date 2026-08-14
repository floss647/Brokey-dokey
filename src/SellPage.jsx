import { useState } from 'react';

const CAR_CATEGORIES = ['Project Car', 'Non-Runner', 'Classic', 'Modern Classic', 'Daily Driver', 'Salvage', 'Other'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Automatic'];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded bg-white"
  >
    {children}
  </select>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded resize-y"
  />
);

export default function SellPage({ onCancel, onPost }) {
  const [step, setStep] = useState('start'); // start | importing | form | done
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', mileage: '',
    price: '', fuelType: '', transmission: '', colour: '',
    engineSize: '', bodyType: '', motExpiry: '', location: '',
    postcode: '', category: 'Project Car', description: '',
    images: [],
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleImport() {
    if (!importUrl.trim()) return;
    setStep('importing');
    setImportError('');
    try {
      const res = await fetch('/api/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm({
        title: data.title || '',
        make: data.make || '',
        model: data.model || '',
        year: data.year || '',
        mileage: data.mileage || '',
        price: data.price || '',
        fuelType: data.fuelType || '',
        transmission: data.transmission || '',
        colour: data.colour || '',
        engineSize: data.engineSize || '',
        bodyType: data.bodyType || '',
        motExpiry: data.motExpiry || '',
        location: data.location || '',
        postcode: data.postcode || '',
        category: 'Project Car',
        description: data.description || '',
        images: data.images || [],
      });
      setStep('form');
    } catch (e) {
      setImportError(e.message || 'Could not import that URL. Try another or enter manually.');
      setStep('start');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const listing = {
      id: Date.now().toString(),
      title: form.title,
      price: parseFloat(form.price) || 0,
      image: form.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      category: form.category,
      description: form.description,
      seller: 'You',
      location: form.location,
      make: form.make,
      model: form.model,
      year: form.year,
      mileage: form.mileage,
      condition: 'For Parts / Not Working',
      difficulty: 'Project',
      sellerRating: 5.0,
      reviews: 0,
    };
    onPost(listing);
  }

  // ── Start screen ─────────────────────────────────────────────────────────────
  if (step === 'start') {
    return (
      <div className="max-w-2xl mx-auto fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onCancel} className="text-sm font-bold underline">← Back</button>
          <h1 className="text-3xl font-black uppercase">List Your Car</h1>
        </div>

        <div className="border-4 border-black p-6 mb-4 bg-yellow-400">
          <div className="font-black uppercase text-lg mb-2">Import from AutoTrader, eBay or Gumtree</div>
          <p className="text-sm mb-4 font-mono">Paste a listing URL and we'll fill in the details automatically.</p>
          <div className="flex gap-2">
            <input
              type="url"
              value={importUrl}
              onChange={e => setImportUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleImport()}
              placeholder="https://www.autotrader.co.uk/car-details/..."
              className="flex-1 border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none"
            />
            <button
              onClick={handleImport}
              className="bg-black text-white px-6 py-2 font-black uppercase hover:bg-gray-800"
            >
              Import
            </button>
          </div>
          {importError && <p className="mt-3 text-sm font-bold text-red-700">{importError}</p>}
        </div>

        <div className="text-center text-sm font-bold text-gray-400 my-4">— or —</div>

        <button
          onClick={() => setStep('form')}
          className="w-full border-4 border-black py-4 font-black uppercase hover:bg-gray-100"
        >
          Enter Details Manually
        </button>
      </div>
    );
  }

  // ── Importing spinner ─────────────────────────────────────────────────────────
  if (step === 'importing') {
    return (
      <div className="max-w-2xl mx-auto fade-in text-center py-24">
        <div className="text-4xl mb-4 animate-spin inline-block">⚙</div>
        <div className="font-black uppercase text-xl">Fetching listing data…</div>
        <p className="font-mono text-sm text-gray-500 mt-2">Loading the page and extracting details. Takes about 10 seconds.</p>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setStep('start')} className="text-sm font-bold underline">← Back</button>
        <h1 className="text-3xl font-black uppercase">
          {form.title ? 'Review Your Listing' : 'New Listing'}
        </h1>
      </div>

      {form.images.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {form.images.slice(0, 6).map((src, i) => (
            <img key={i} src={src} alt="" className="h-24 w-24 object-cover border-2 border-black flex-shrink-0 rounded" />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <Field label="Title *">
          <Input required value={form.title} onChange={set('title')} placeholder="e.g. 2008 Honda Civic Type R — non-runner" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Make">
            <Input value={form.make} onChange={set('make')} placeholder="Honda" />
          </Field>
          <Field label="Model">
            <Input value={form.model} onChange={set('model')} placeholder="Civic Type R" />
          </Field>
          <Field label="Year">
            <Input type="number" value={form.year} onChange={set('year')} placeholder="2008" />
          </Field>
          <Field label="Mileage">
            <Input type="number" value={form.mileage} onChange={set('mileage')} placeholder="87000" />
          </Field>
          <Field label="Asking Price (£) *">
            <Input required type="number" value={form.price} onChange={set('price')} placeholder="1200" />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={set('category')}>
              {CAR_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Fuel Type">
            <Select value={form.fuelType} onChange={set('fuelType')}>
              <option value="">—</option>
              {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Transmission">
            <Select value={form.transmission} onChange={set('transmission')}>
              <option value="">—</option>
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Colour">
            <Input value={form.colour} onChange={set('colour')} placeholder="Championship White" />
          </Field>
          <Field label="Engine Size">
            <Input value={form.engineSize} onChange={set('engineSize')} placeholder="2.0" />
          </Field>
          <Field label="MOT Expiry">
            <Input value={form.motExpiry} onChange={set('motExpiry')} placeholder="None / Jan 2025" />
          </Field>
          <Field label="Postcode">
            <Input value={form.postcode} onChange={set('postcode')} placeholder="SW1A 1AA" />
          </Field>
        </div>

        <Field label="Location">
          <Input value={form.location} onChange={set('location')} placeholder="London" />
        </Field>

        <Field label="Description — what's wrong with it, what works, why selling?">
          <Textarea rows={5} value={form.description} onChange={set('description')} placeholder="Be honest — buyers respect it and you'll get better offers." />
        </Field>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-4 font-black uppercase text-lg hover:bg-gray-800 border-4 border-black"
          >
            List It
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border-4 border-black py-4 px-6 font-black uppercase hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
