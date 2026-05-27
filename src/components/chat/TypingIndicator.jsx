function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="
          bg-slate-800
          px-4
          py-3
          rounded-2xl
          flex
          items-center
          gap-2
        "
      >

        <span
          className="
            w-2
            h-2
            rounded-full
            bg-slate-400
            animate-bounce
          "
        />

        <span
          className="
            w-2
            h-2
            rounded-full
            bg-slate-400
            animate-bounce
            [animation-delay:0.2s]
          "
        />

        <span
          className="
            w-2
            h-2
            rounded-full
            bg-slate-400
            animate-bounce
            [animation-delay:0.4s]
          "
        />

      </div>
    </div>
  );
}

export default TypingIndicator;