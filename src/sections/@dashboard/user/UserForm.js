import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
// ? @mui
import {
  Dialog,
  Stack,
  Typography,
  FormControlLabel,
  Grid,
  Card,
  Box,
  Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// ? components
import Scrollbar from "../../../components/Scrollbar";
// ? form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// ? utils
import { fData } from "../../../utils/formatNumber";
// ? components
import Label from "../../../components/Label";
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import axios from "../../../utils/axios";

// ----------------------------------------------------------------------

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

UserForm.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.func,
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserForm({
  open,
  onClose,
  isEdit = false,
  currentUser,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email(),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role Number is required"),
    avatarUrl: Yup.mixed().test(
      "required",
      "Avatar is required",
      (value) => value !== ""
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      avatarUrl: currentUser?.avatarUrl || "",
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      role: currentUser?.role || "",
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser, open]);

  const onSubmit = async (data) => {
    try {
      data.password = "123456";
      let JSONdata = JSON.stringify(data);

      let resp = async () =>
        isEdit
          ? await axios.put("/api/user/" + currentUser.id, JSONdata, {
              headers: {
                "Content-Type": "application/json",
              },
            })
          : await axios.post("/api/user", JSONdata, {
              headers: {
                "Content-Type": "application/json",
              },
            });

      resp()
        .then(async (res) => {
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (res.data.code !== 200) {
            return enqueueSnackbar("Error", { variant: "error" });
          }

          enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
        })
        .finally(() => {
          reset();
          onClose();
        });
    } catch (error) {
      enqueueSnackbar("Error", { variant: "error" });
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "avatarUrl",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" sx={{ py: 2.5, px: 3 }}>
          <Typography variant="h6"> {isEdit ? "Edit" : "Add"} User </Typography>
        </Stack>
        <Scrollbar sx={{ p: 3, pt: 0, maxHeight: 80 * 8 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                {isEdit && (
                  <Label
                    color={values.status !== "active" ? "error" : "success"}
                    sx={{
                      textTransform: "uppercase",
                      position: "absolute",
                      top: 24,
                      right: 24,
                    }}
                  >
                    {values.status}
                  </Label>
                )}

                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="avatarUrl"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>

                {isEdit && (
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value !== "active"}
                            onChange={(event) =>
                              field.onChange(
                                event.target.checked ? "banned" : "active"
                              )
                            }
                          />
                        )}
                      />
                    }
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Banned
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Apply disable account
                        </Typography>
                      </>
                    }
                    sx={{
                      mx: 0,
                      mb: 3,
                      width: 1,
                      justifyContent: "space-between",
                    }}
                  />
                )}

                <RHFSwitch
                  name="isVerified"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Email Verified
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Disabling this will automatically send the user a
                        verification email
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                    },
                  }}
                >
                  <RHFTextField name="name" label="Full Name" />
                  <RHFTextField name="email" label="Email Address" />
                  <RHFTextField name="phone" label="Phone Number" />
                  <RHFSelect name="role" label="Role">
                    {ROLES.map((role, i) => (
                      <option key={i} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {!isEdit ? "Create User" : "Save Changes"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Scrollbar>
      </FormProvider>
    </Dialog>
  );
}
