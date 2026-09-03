import { Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className={`w-full ${maxWidth} rounded-[24px] bg-white dark:bg-brand-800 shadow-2xl`}>
              <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 px-6 py-4">
                <DialogTitle className="font-display text-lg font-semibold text-ink dark:text-white">{title}</DialogTitle>
                <button onClick={onClose} className="rounded-full p-1.5 text-ink/50 dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
