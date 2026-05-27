function AuthLayout({
  title,
  subtitle,
  children,
}) {

  return (
    <div className="
      min-h-screen

      bg-[#121212]

      flex
      items-center
      justify-center

      px-6
      py-10
    ">

      <div className="
        w-full
        max-w-5xl

        grid
        grid-cols-1
        lg:grid-cols-2

        overflow-hidden

        rounded-3xl

        border
        border-[#2A2A2A]

        bg-[#171717]

        shadow-2xl
      ">

        {/* LEFT */}
        <div className="
          hidden
          lg:flex

          flex-col
          justify-between

          p-12

          bg-[#141414]

          border-r
          border-[#262626]
        ">

          <div>

            {/* Logo */}
            <div className="
              w-16
              h-16

              rounded-2xl

              bg-[#E8DCCF]

              flex
              items-center
              justify-center

              text-[#121212]

              text-2xl
              font-bold

              mb-8
            ">
              B
            </div>

            {/* Heading */}
            <h1 className="
              text-5xl
              font-bold

              text-[#E8DCCF]

              leading-tight
            ">
              Brainova AI
            </h1>

            {/* Subtitle */}
            <p className="
              mt-5

              text-[#8A8178]

              text-lg

              leading-relaxed

              max-w-md
            ">
              Modern AI workspace for
              conversations, documents,
              and intelligent productivity.
            </p>

          </div>

          {/* Bottom */}
          <p className="
            text-sm
            text-[#666]
          ">
            Premium AI assistant experience.
          </p>

        </div>

        {/* RIGHT */}
        <div className="
          flex
          items-center
          justify-center

          p-6
          md:p-12
        ">

          <div className="
            w-full
            max-w-md
          ">

            {/* Mobile Logo */}
            <div className="
              lg:hidden

              flex
              justify-center

              mb-8
            ">

              <div className="
                w-16
                h-16

                rounded-2xl

                bg-[#E8DCCF]

                flex
                items-center
                justify-center

                text-[#121212]

                text-2xl
                font-bold
              ">
                B
              </div>

            </div>

            {/* Heading */}
            <div className="
              mb-8
            ">

              <h2 className="
                text-4xl
                font-bold

                text-[#E8DCCF]
              ">
                {title}
              </h2>

              <p className="
                mt-3

                text-[#777]

                text-base
              ">
                {subtitle}
              </p>

            </div>

            {/* Form */}
            {children}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;