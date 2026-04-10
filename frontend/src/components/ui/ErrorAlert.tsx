interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
      {message}
    </div>
  );
}
