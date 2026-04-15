export function ContactGlyph({ kind }) {
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.75 8.25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-1.25 2h2.5v8.25H5.5v-8.25Zm4 0H12v1.13c.5-.8 1.42-1.38 2.95-1.38 2.32 0 3.55 1.5 3.55 4.15v4.35H16v-3.97c0-1.36-.5-2.3-1.75-2.3-1.08 0-1.68.72-1.95 1.4-.1.23-.12.54-.12.85v4.02H9.5v-8.25Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.48.09.66-.2.66-.46v-1.73c-2.72.59-3.29-1.16-3.29-1.16-.44-1.12-1.08-1.42-1.08-1.42-.88-.61.07-.6.07-.6.97.07 1.49 1 1.49 1 .87 1.49 2.27 1.06 2.82.81.09-.62.34-1.05.63-1.29-2.18-.25-4.46-1.09-4.46-4.84 0-1.07.38-1.95 1.01-2.64-.1-.24-.44-1.26.1-2.64 0 0 .82-.27 2.69 1a9.27 9.27 0 0 1 4.9 0c1.87-1.27 2.69-1 2.69-1 .54 1.38.2 2.4.1 2.64.63.69 1.01 1.57 1.01 2.64 0 3.76-2.28 4.58-4.46 4.83.35.31.66.9.66 1.8v2.64c0 .26.18.55.67.46A9.75 9.75 0 0 0 12 2.25Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (kind === "blog") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 5.5A2.5 2.5 0 0 1 8.5 3H19v16.5A1.5 1.5 0 0 0 17.5 18H6.75A2.75 2.75 0 0 1 4 15.25V8a2.5 2.5 0 0 1 2-2.45V5.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 7h7M8 10h7M8 13h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "resume") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 3.5h6.5L19 8v12.5H8A3 3 0 0 1 5 17.5v-11A3 3 0 0 1 8 3.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 3.5V8H19M9 11h6M9 14h6M9 17h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7.8 4.5h2l1.2 4.1-1.9 1.9a14.3 14.3 0 0 0 4.4 4.4l1.9-1.9 4.1 1.2v2a1.8 1.8 0 0 1-2 1.8A15 15 0 0 1 6 6.5a1.8 1.8 0 0 1 1.8-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 7.5 12 13l7.5-5.5M6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
