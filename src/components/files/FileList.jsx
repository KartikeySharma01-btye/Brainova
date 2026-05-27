import {
  FileText,
  Trash2,
} from "lucide-react";

function FileList({
  files = [],
  onDelete,
}) {

  return (
    <div className="
      w-full

      space-y-2
    ">

      {/* Empty */}
      {files.length === 0 && (

        <div className="
          text-sm

          text-[#666]

          text-center

          py-6
        ">
          No uploaded files
        </div>

      )}

      {/* Files */}
      {files.map((file, index) => (

        <div
          key={
            file.id ||
            index
          }

          className="
            flex
            items-center
            justify-between

            gap-3

            px-4
            py-3

            rounded-xl

            border
            border-[#262626]

            bg-[#1A1A1A]
          "
        >

          {/* Left */}
          <div className="
            flex
            items-center
            gap-3

            min-w-0
          ">

            {/* Icon */}
            <div className="
              w-10
              h-10

              rounded-xl

              bg-[#232323]

              flex
              items-center
              justify-center
            ">

              <FileText
                size={18}

                className="
                  text-[#E8DCCF]
                "
              />

            </div>

            {/* File Info */}
            <div className="
              min-w-0
            ">

              <p className="
                text-sm

                text-[#E8DCCF]

                truncate
              ">

                {
                  file.filename ||
                  file.name ||
                  "Untitled File"
                }

              </p>

              <p className="
                text-xs

                text-[#666]
              ">

                {
                  file.size
                    ? `${(
                        file.size /
                        1024
                      ).toFixed(1)} KB`
                    : "Uploaded file"
                }

              </p>

            </div>

          </div>

          {/* Delete */}
          <button
            onClick={() =>
              onDelete?.(
                file.id
              )
            }

            className="
              p-2

              rounded-lg

              transition-all

              hover:bg-[#252525]
            "
          >

            <Trash2
              size={16}

              className="
                text-red-400
              "
            />

          </button>

        </div>

      ))}

    </div>
  );
}

export default FileList;