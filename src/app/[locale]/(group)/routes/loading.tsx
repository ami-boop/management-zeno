import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='min-h-screen bg-zeno-surface'>
      <div className='max-w-4xl mx-auto px-4 sm:px-8 py-8'>
        <div className='flex flex-col sm:flex-row justify-between gap-3 mb-6'>
          <h1 className='text-3xl font-bold text-zeno-ink flex items-center gap-2'>
            <Skeleton className='h-8 w-48' />
          </h1>
        </div>

        <div className='mb-6'>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            </span>
            <Skeleton className='h-10 w-full rounded-md' />
          </div>
        </div>

        {/* Desktop Table Skeleton */}
        <div className='hidden md:flex px-4 py-3 overflow-hidden rounded-xl border border-[#dbe1e6] bg-zeno-surface'>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-medium'>
                  <Skeleton className='h-5 w-24' />
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium'>
                  <Skeleton className='h-5 w-16' />
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium'>
                  <Skeleton className='h-5 w-20' />
                </th>
                <th className='px-4 py-3 text-left text-sm font-medium'>
                  <Skeleton className='h-5 w-24' />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='border-t'>
                  <td className='px-4 py-3 text-sm'>
                    <Skeleton className='h-5 w-32' />
                  </td>
                  <td className='px-4 py-3 text-sm text-[#617989]'>
                    <Skeleton className='h-5 w-12' />
                  </td>
                  <td className='px-4 py-3 text-sm text-[#617989] flex items-center gap-2'>
                    <Skeleton className='h-5 w-8' />
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <Skeleton className='h-5 w-20' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className='md:hidden px-4 py-3 space-y-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='bg-zeno-surface border border-[#dbe1e6] rounded-xl p-4 space-y-3'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <Skeleton className='h-6 w-32 mb-2' />
                  <Skeleton className='h-4 w-40' />
                </div>
                <Skeleton className='h-8 w-24 rounded-full' />
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-[#dbe1e6]'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
