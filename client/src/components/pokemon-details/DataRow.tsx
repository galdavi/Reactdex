
interface DataRowProps {
    label: string;
    value: React.ReactNode;
};
export default function DataRow({ label, value }: DataRowProps) {
    const rowStyle = "flex py-1 items-center py-2 gap-2";
    const headStyle = "flex flex-1 flex-wrap text-sm text-secondary";
    return (
        <div className={rowStyle}>
            <span className={headStyle}>{label}</span>
            {(typeof(value) === "string")? <span>{value}</span> : <div>{value}</div>}
        </div>
    );
}