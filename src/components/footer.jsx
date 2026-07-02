export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white p-4 text-center mt-auto text-sm border-t border-slate-800">
      <p>© {new Date().getFullYear()} Emmakespo. All rights reserved.</p>
    </footer>
  );
}