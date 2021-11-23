import { InputHTMLAttributes, useEffect, useRef } from "react";
import { useField } from "@unform/core";
interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const InputText = ({ name, ...rest }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
    });
  }, [fieldName, registerField]);
  return (
    <>
      <input type="text" id={fieldName} ref={inputRef} {...rest} />
    </>
  );
};

export default InputText;
