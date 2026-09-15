import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='bg-zeno-paper-soft'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Skeleton */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <Skeleton className='h-8 w-48 mb-2' />
              <Skeleton className='h-4 w-64' />
            </div>
            <Skeleton className='h-10 w-24 rounded-md' />
          </div>

          {/* Stats Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-zeno-surface rounded-lg border border-zeno-line p-6'>
              <Skeleton className='h-4 w-32 mb-2' />
              <Skeleton className='h-8 w-16' />
            </div>
            <div className='bg-zeno-surface rounded-lg border border-zeno-line p-6'>
              <Skeleton className='h-4 w-32 mb-2' />
              <Skeleton className='h-8 w-16' />
            </div>
            <div className='bg-zeno-surface rounded-lg border border-zeno-line p-6'>
              <Skeleton className='h-4 w-32 mb-2' />
              <Skeleton className='h-8 w-16' />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className='bg-zeno-surface rounded-lg shadow-sm border border-zeno-line'>
          <div className='px-6 py-4 border-b border-zeno-line'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
              <Skeleton className='h-7 w-40' />
              <Skeleton className='h-10 w-64 rounded-md' />
            </div>

            {/* Filters Skeleton */}
            <div className='flex flex-wrap gap-2 mb-4'>
              <Skeleton className='h-8 w-24 rounded-md' />
              <Skeleton className='h-8 w-24 rounded-md' />
              <Skeleton className='h-8 w-24 rounded-md' />
              <Skeleton className='h-8 w-24 rounded-md' />
            </div>
          </div>

          {/* Desktop Table Skeleton */}
          <div className='hidden lg:block overflow-hidden'>
            <table className='min-w-full divide-y divide-zeno-line'>
              <thead className='bg-zeno-paper-soft'>
                <tr>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-4' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-24' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-20' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-32' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-20' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-20' />
                  </th>
                  <th className='px-6 py-3'>
                    <Skeleton className='h-4 w-24' />
                  </th>
                </tr>
              </thead>
              <tbody className='bg-zeno-surface divide-y divide-zeno-line'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-4 w-4' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-32' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-20' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-40' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-24' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-5' />
                    </td>
                    <td className='px-6 py-4'>
                      <Skeleton className='h-5 w-32' />
                      <Skeleton className='h-3 w-24 mt-1' />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Skeleton */}
          <div className='lg:hidden divide-y divide-zeno-line'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <Skeleton className='h-4 w-4 rounded' />
                    <div>
                      <Skeleton className='h-5 w-32 mb-1' />
                      <Skeleton className='h-4 w-20' />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <Skeleton className='h-4 w-12 mb-1' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <div>
                    <Skeleton className='h-4 w-12 mb-1' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-3 p-2'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-6 w-6 rounded-full' />
                  </div>
                  <div className='p-2'>
                    <Skeleton className='h-4 w-16 mb-1' />
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-20 mt-1' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
