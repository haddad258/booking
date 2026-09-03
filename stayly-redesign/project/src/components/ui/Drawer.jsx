import { Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Drawer({ open, onClose, side = 'left', title, children, widthClass = 'max-w-xs' }) {
  const isLeft = side === 'left';
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/55 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className={`fixed inset-y-0 flex w-full ${widthClass} ${isLeft ? 'left-0' : 'right-0'}`}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-250" enterFrom={isLeft ? '-translate-x-full' : 'translate-x-full'} enterTo="translate-x-0"
            leave="ease-in duration-200" leaveFrom="translate-x-0" leaveTo={isLeft ? '-translate-x-full' : 'translate-x-full'}
          >
            <DialogPanel className="flex h-full w-full flex-col bg-white dark:bg-brand-800 shadow-2xl">
              <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 px-5 py-4">
                <span className="font-display text-lg font-semibold text-ink dark:text-white">{title}</span>
                <button onClick={onClose} className="rounded-full p-1.5 text-ink/50 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
