import { Table, TableRow, TableCell } from '../components/Table';
import { Button } from '../components/Button';

export function Tokens() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">توکن‌ها</h1>
        <Button>ایجاد توکن جدید</Button>
      </div>

      <Table columns={['نام', 'اشتراک مرتبط', 'تاریخ ایجاد', 'تاریخ انقضا', 'عملیات']}>
        <TableRow>
          <TableCell>توکن موبایل من</TableCell>
          <TableCell dir="ltr">sub_123</TableCell>
          <TableCell>1403/05/01</TableCell>
          <TableCell>1403/12/29</TableCell>
          <TableCell>
            <Button variant="danger" className="text-sm px-2 py-1">ابطال</Button>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
