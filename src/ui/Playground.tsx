import Card from './Card';
import Button from './Button';
import Input from './Input';

export default function Playground() {
  return (
    <div className="space-y-4 p-4">
      <Card>
        <div className="mb-2 font-semibold">Card title</div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Card content</p>
      </Card>
      <Button onClick={() => alert('clicked')}>Click me</Button>
      <Input placeholder="Type here" />
    </div>
  );
}
