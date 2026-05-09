export default function MapSection() {
  return (
    <section id="map" className="relative py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">MAP</h2>
          <p className="mt-3 text-gray-400">
            Location of IIITDM Kurnool campus.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1e293b] bg-[#0a0d14] p-2 shadow-xl shadow-blue-500/5">
          <div className="h-[420px] w-full overflow-hidden rounded-xl">
            <iframe
              title="IIITDM Kurnool Map"
              src="https://maps.google.com/maps?q=IIITDM%20Kurnool&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
