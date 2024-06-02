
const InvalidSession = () => {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="mx-4 max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <div className="space-y-2 text-center">
        <TriangleAlertIcon className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Invalid Session</h1>
        <p className="text-gray-500 dark:text-gray-400">Your session is not valid anymore. Please try again.</p>
      </div>
    
    </div>
  </div>
  );
};
function TriangleAlertIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
export default InvalidSession;
