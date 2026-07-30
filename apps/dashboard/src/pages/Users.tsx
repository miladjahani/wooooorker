import { Table, TableRow, TableCell } from '../components/Table';
import { Button } from '../components/Button';

export function Users() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">کاربران</h1>
        <Button>افزودن کاربر جدید</Button>
      </div>

      <Table columns={['نام', 'ایمیل', 'نقش', 'وضعیت', 'عملیات']}>
        <TableRow>
          <TableCell>ادمین سیستم</TableCell>
          <TableCell dir="ltr">admin@admin.com</TableCell>
          <TableCell>ADMIN</TableCell>
          <TableCell><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">فعال</span></TableCell>
          <TableCell>
            <Button variant="secondary" className="text-sm px-2 py-1">ویرایش</Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
