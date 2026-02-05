export const metadata = {
  title: 'Hello World - Firebase App Hosting',
  description: 'A simple Next.js app with Firestore',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}