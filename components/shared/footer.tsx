export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} AI Resume Tracker</p>
        <p>Track every job application in one dashboard.</p>
      </div>
    </footer>
  );
}
