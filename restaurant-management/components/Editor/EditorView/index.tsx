import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { Box, Typography } from "@mui/material";

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

export interface IEditorView<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    required?: boolean;
    control: Control<T, any>;
    disabled?: boolean;
    maxHeight?: string;
    rules: Omit<RegisterOptions<T>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const EditorView = <T extends {}>(props: IEditorView<T>) => {
    const { name, control, rules, label, disabled, maxHeight, required = false, ...rest } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value: currentValue, onChange } }) => {
                return (
                    <Box display="flex" flexDirection="column">
                        {label && (
                            <Typography
                                fontSize="14px"
                                ml={1.5}
                                color="rgba(0, 0, 0, 0.7)"
                                fontWeight="400"
                                lineHeight="1.5"
                            >
                                {label}{" "}
                                {required && (
                                    <span
                                        style={{
                                            color: "red",
                                        }}
                                    >
                                        *
                                    </span>
                                )}
                            </Typography>
                        )}

                        <SunEditor
                            autoFocus={false}
                            setContents={currentValue ? String(currentValue) : ""}
                            onChange={onChange}
                            disable={disabled}
                            // defaultValue={value}
                            setOptions={{
                                buttonList: [
                                    ["undo", "redo"],
                                    ["font", "fontSize"],
                                    // ['paragraphStyle', 'blockquote'],
                                    [
                                        "bold",
                                        "underline",
                                        "italic",
                                        "strike",
                                        "subscript",
                                        "superscript",
                                    ],
                                    ["fontColor", "hiliteColor"],
                                    ["align", "list", "lineHeight"],
                                    ["outdent", "indent"],

                                    ["table", "horizontalRule", "link", "image", "video"],
                                    // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                    // ['imageGallery'], // You must add the "imageGalleryUrl".
                                    // ["fullScreen", "showBlocks", "codeView"],
                                    ["preview", "print"],
                                    ["removeFormat"],

                                    // ['save', 'template'],
                                    // '/', Line break
                                ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                defaultTag: "div",
                                minHeight: "300px",
                                maxHeight: maxHeight ? maxHeight : "100%",
                                width: "100%",
                                showPathLabel: false,
                            }}
                            {...rest}
                        />
                    </Box>
                );
            }}
        />
    );
};

export default EditorView;
