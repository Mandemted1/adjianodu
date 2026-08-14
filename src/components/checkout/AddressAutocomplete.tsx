"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
  }
}

interface AddressParts {
  address: string;
  city: string;
  region: string;
  country: string;
  postal: string;
}

const COUNTRY_OPTIONS = ["Ghana", "Nigeria", "United Kingdom", "United States", "Canada", "France"];

function parsePlace(place: any): AddressParts | null {
  const components: { longText: string; shortText: string; types: string[] }[] = place.addressComponents ?? [];
  const get = (type: string) => components.find((c) => c.types.includes(type))?.longText ?? "";

  const streetNumber = get("street_number");
  const route = get("route");
  const streetAddress = [streetNumber, route].filter(Boolean).join(" ") || place.displayName || place.formattedAddress || "";

  const city = get("locality") || get("sublocality") || get("administrative_area_level_2");
  const region = get("administrative_area_level_1");
  const countryLong = get("country");
  const country = COUNTRY_OPTIONS.includes(countryLong) ? countryLong : "Other";
  const postal = get("postal_code");

  if (!streetAddress) return null;
  return { address: streetAddress, city, region, country, postal };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  required,
  style,
}: {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (parts: AddressParts) => void;
  placeholder?: string;
  required?: boolean;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<any>(null);
  const [, setReady] = useState(false);

  const initAutocomplete = () => {
    if (!containerRef.current || elementRef.current) return;

    // The script's "load" event fires once the bootstrap loader downloads —
    // libraries=places is fetched separately right after, so poll until it lands.
    if (!window.google?.maps?.places?.PlaceAutocompleteElement) {
      setTimeout(initAutocomplete, 100);
      return;
    }

    const el = new window.google.maps.places.PlaceAutocompleteElement();
    if (required) el.setAttribute("required", "");
    containerRef.current.appendChild(el);

    el.addEventListener("gmp-select", async ({ placePrediction }: any) => {
      const place = placePrediction.toPlace();
      await place.fetchFields({ fields: ["addressComponents", "formattedAddress", "displayName"] });
      const parts = parsePlace(place);
      if (parts) {
        onChange(parts.address);
        onPlaceSelect(parts);
      }
    });

    el.addEventListener("input", () => onChange(el.value ?? ""));

    elementRef.current = el;
    setReady(true);
  };

  // Keep the widget's internal text in sync if the address is set/cleared from outside
  // (e.g. switching between the saved-address view and edit mode).
  useEffect(() => {
    if (elementRef.current && elementRef.current.value !== value) {
      elementRef.current.value = value;
    }
  }, [value]);

  return (
    <>
      <Script
        id="google-maps-places"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        strategy="afterInteractive"
        onReady={initAutocomplete}
      />
      <div ref={containerRef} style={{ width: "100%", ...style }} />
    </>
  );
}
