import { useState } from "react";

import { Control, Controller, Path, RegisterOptions } from "react-hook-form";

import { Autocomplete, AutocompleteProps } from "@mui/material";
import useGetListEntity from "./hooks/useGetListEntity";
import React from "react";
import TextfieldBase from "components/BaseTextField";

export interface ICustomizeAuto<
    T extends {},
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
> extends Omit<
        AutocompleteProps<
            { key: number; value: string; conditionField: boolean },
            Multiple,
            DisableClearable,
            FreeSolo
        >,
        "options" | "renderInput"
    > {
    control: Control<T, any>;
    name: Path<T>;
    entity: string;
    displayField: string;
    label: string;
    readonly?: boolean;
    disabled?: boolean;
    onGetConditionState?: (condition: boolean) => void;
    fullWidth?: boolean;
    extraJoinFilter?: string;
    extraWhereFilter?: string;
    rules?: Omit<RegisterOptions<T>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    defaultId?: number;
    conditionField: string;
    required?: boolean;
    type?: "object" | "key";
}

const CustomizeAutocomplete = <T extends {}>(props: ICustomizeAuto<T>) => {
    const {
        control,
        name,
        entity,
        displayField,
        readonly,
        label,
        disabled,
        rules,
        defaultId,
        onGetConditionState,
        required,
        type,
        ...rest
    } = props;

    const [search, setSearch] = useState("");
    const { data, isLoading } = useGetListEntity(entity, displayField, search);

    const [autoCompleteKey, setAutoCompleteKey] = useState(
        defaultId !== undefined && !!defaultId ? defaultId : 0
    );

    const [autoCompleteValue, setAutoCompleteValue] = useState("");

    const [autoCompleteCondition, setAutoCompleteCondition] = useState(false);

    React.useEffect(() => {
        if (defaultId) {
            setAutoCompleteKey(defaultId);
        }
    }, [defaultId]);

    React.useEffect(() => {
        const getData = (key: number): { key: number; value: string; conditionField: boolean } => {
            const value: Array<{ key: number; value: string; conditionField: boolean }> = data
                ? data[entity]
                : [];
            const index: number = value.findIndex((x) => x.key === key);
            if (index != -1) {
                return value[index];
            }
            return {
                key: key,
                value: "",
                conditionField: false,
            };
        };
        if (data && data[entity].length > 0) {
            setAutoCompleteValue(getData(autoCompleteKey).value);
            setAutoCompleteCondition(getData(autoCompleteKey).conditionField);
        }
    }, [data, entity, autoCompleteKey]);
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value: currentValue, ref, onChange }, fieldState: { error } }) => {
                return (
                    <Autocomplete<{ key: number; value: string; conditionField: boolean }>
                        {...rest}
                        id="select-customize"
                        options={data ? data[entity] : []}
                        getOptionLabel={(option) => option.value}
                        value={
                            !currentValue
                                ? null
                                : {
                                      key: Number(currentValue),
                                      value: autoCompleteValue,
                                      conditionField: autoCompleteCondition,
                                  }
                        }
                        fullWidth={props.fullWidth}
                        isOptionEqualToValue={(option, value) =>
                            !option.key || !value.key || option.key === value.key
                        }
                        loading={isLoading}
                        onChange={(e, newValue) => {
                            if (newValue) {
                                if (type === undefined || type === "key") {
                                    onChange(Number(newValue.key));
                                } else if (type === "object") {
                                    onChange(newValue);
                                }
                                setAutoCompleteKey(newValue.key);
                                setAutoCompleteValue(newValue.value);
                                onGetConditionState && onGetConditionState(newValue.conditionField);
                            }
                        }}
                        onInputChange={(e, value, reason) => {
                            if (reason === "input" || reason === "clear") {
                                onChange(0);
                                setSearch(value);
                            }
                        }}
                        readOnly={readonly}
                        disabled={disabled}
                        ref={ref}
                        renderInput={(params) => (
                            <TextfieldBase
                                {...params}
                                label={label}
                                required={required}
                                inputRef={ref}
                                ref={ref}
                                error={Boolean(error)}
                                helperText={Boolean(error) && error?.message}
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default CustomizeAutocomplete;
