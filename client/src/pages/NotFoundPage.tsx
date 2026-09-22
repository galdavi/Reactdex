export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full gap-2">
            <h1 className="text-4xl font-semibold">Page not found!</h1>
            <p className="text-sm text-secondary">
                The requested page could not be found. Please check the URL and try again.
            </p>
        </div>
    );
}