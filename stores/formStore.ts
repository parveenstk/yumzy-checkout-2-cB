// import { defineStore } from 'pinia'; 9
import { defineStore } from 'pinia';
import { reactive, ref, type Reactive } from 'vue';
import { object, z, ZodError } from 'zod';
import { useCheckoutStore } from './checkoutStore';

export const useFormStore = defineStore('formStore', () => {

    // Checkout Store
    const checkoutStore = useCheckoutStore();

    // Payment method state ( 'creditCard' default selected )
    const paymentMethod = ref<'creditCard' | 'payPal' | null>('creditCard');

    // same billing
    const sameBilling = ref(true);

    // loader
    const transactionStatus = ref(false);

    // order details 
    const orderDetails = ref({});

    // check required fields
    const hasEmptyFields = ref(false);

    // check on submit required fields
    const hasAttemptedSubmit = ref(false);

    // Any error on input fields
    const hasAnyError = computed(() => {
        return Object.values(errors).some(Boolean);
    });

    // global error message
    const globalError = ref('');

    // computed form message
    const formMessage = computed(() => {
        if (hasEmptyFields.value && hasAttemptedSubmit.value) {
            return 'Please fill in the required fields above';
        }

        if (hasAnyError.value && hasAttemptedSubmit.value) {
            return globalError.value || 'Please fix the highlighted fields above';
        }

        return '';
    });

    // importOrder response
    const apiErrorAlert: Ref<{ status: boolean; message: string }> = ref({ status: false, message: "" })

    const formFields: Reactive<FormFields> = reactive({

        // Basic fields
        shipFirstName: '',
        shipLastName: '',
        email: '',
        phoneNumber: '',

        // Shipping fields
        shipStreetAddress: '',
        shipApptsAddress: '',
        shipCity: '',
        shipCountry: 'US',
        shipState: '',
        shipPostalCode: '',

        // Credit card fields
        creditCardNumber: '',
        cardCVV: '',
        expiryMonth: '',
        expiryYear: '',

        // Billing fields
        billingFirstName: '',
        billingLastName: '',
        billingStreetAddress: '',
        billingApptsAddress: '',
        billingCity: '',
        billingCounty: '',
        billingState: '',
        billingPostalCode: '',

        // Ship Profile
        shipProfile: '36'
    })

    // payPal fields
    const payPalFields: (keyof FormFields)[] = ['shipFirstName', 'shipLastName', 'email', 'phoneNumber'];

    // Watch form fields for changes and clear hasEmptyFields flag if all required fields are filled
    watch(formFields, () => {
        if (!hasAttemptedSubmit.value) return;

        const isPayPal = paymentMethod.value === 'payPal';
        const fieldsToCheck = isPayPal ? payPalFields : requiredFields;
        const anyEmpty = fieldsToCheck.some(field => {
            return !formFields[field] || formFields[field].toString().trim() === '';
        });
        // console.log("anyEmpty:", anyEmpty);

        hasEmptyFields.value = anyEmpty;
        // console.log("hasEmptyFields updated to:", hasEmptyFields.value);
    }, { deep: true });

    // Zod schema
    const nameRegex = /^[A-Za-zÀ-ÿ\-'\s]{2,15}$/
    const cityRegex = /^[A-Za-zÀ-ÿ\s\-]{2,15}$/
    const stateRegex = /^[A-Z]{2}$/
    const postalCodeRegex = /^[A-Za-z0-9\s]{3,10}$/
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/
    const streetRegex = /^[A-Za-z0-9À-ÿ\s,'\-\.]{5,100}$/

    // Basic schema (always required for both payment methods)
    const basicSchema = z.object({
        shipFirstName: z.string()
            .nonempty('This field is required')
            .min(2, 'Shipping first name must be at least 2 characters')
            .max(15, 'Shipping first name must be at most 15 characters')
            .regex(nameRegex, 'Shipping first name contains only letters'),
        shipLastName: z.string()
            .nonempty('This field is required')
            .min(2, 'Shipping last name must be at least 2 characters')
            .max(15, 'Shipping last name must be at most 15 characters')
            .regex(nameRegex, 'Shipping last name contains only letters'),
        email: z.email('Email format should be "name@example.com"')
            .nonempty('This field is required'),
        phoneNumber: z.string()
            .nonempty('This field is required')
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits')
            .regex(phoneRegex, 'Phone contains only numbers'),
    });

    const schema = z.object({

        // Basic
        shipFirstName: z.string()
            .nonempty('This field is required')
            .min(2, 'Shipping first name must be at least 2 characters')
            .max(15, 'Shipping first name must be at most 15 characters')
            .regex(nameRegex, 'Shipping first name contains only letters'),
        shipLastName: z.string()
            .nonempty('This field is required')
            .min(2, 'Shipping first name must be at least 2 characters')
            .max(15, 'Shipping first name must be at most 15 characters')
            .regex(nameRegex, 'Shipping last name contains only letters'),
        email: z.email('Email format should be "name@example.com"')
            .nonempty('This field is required'),
        phoneNumber: z.string()
            .nonempty('This field is required')
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits')
            .regex(phoneRegex, 'Phone contains only numbers'),

        // Shipping Address
        shipStreetAddress: z.string()
            .nonempty('This field is required')
            .min(5, 'Street address must be at least 5 characters')
            .max(100, 'Street address must be at most 100 characters')
            .regex(streetRegex, 'Invalid street address'),

        shipApptsAddress: z.string().optional(),
        shipCity: z.string()
            .nonempty('This field is required')
            .min(2, 'City must be at least 2 characters.')
            .max(30, 'City must be at most 30 characters.')
            .regex(cityRegex, 'City name can only contain letters'),
        shipCountry: z.string().regex(cityRegex, 'Invalid county'),
        shipState: z.string().regex(stateRegex, 'Invalid state'),
        shipPostalCode: z.string()
            .trim()
            .nonempty('This field is required')
            .min(3, 'Postal code must be at least 3 characters')
            .max(10, 'Postal code must be at most 10 characters')
            .regex(postalCodeRegex, 'Postal code must contain only letters, numbers, and spaces'),

        // Credit card
        creditCardNumber: z.string()
            .nonempty('This field is required')
            .min(16, 'Credit card number must be at least 16 digits')
            .regex(/^\d{15,16}$/, 'Invalid credit card number'),

        cardCVV: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
        expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
        expiryYear: z.string().regex(/^\d{4}$/, 'Invalid year'),

        // Billing Address
        billingFirstName: z.string()
            .nonempty('This field is required')
            .min(2, 'First name must be at least 2 characters')
            .max(15, 'First name must be at most 15 characters')
            .regex(nameRegex, 'First name must contain only letters'),
        billingLastName: z.string().optional(),
        billingStreetAddress: z.string()
            .nonempty('This field is required')
            .min(5, 'Street address must be at least 5 characters')
            .max(100, 'Street address must be at most 100 characters')
            .regex(streetRegex, 'Invalid street address'),
        billingApptsAddress: z.string().optional(),
        billingCity: z.string()
            .nonempty('This field is required')
            .min(2, 'City must be at least 2 characters.')
            .max(30, 'City must be at most 30 characters.')
            .regex(cityRegex, 'Invalid city name.'),
        billingCounty: z.string().regex(cityRegex, 'Invalid county'),
        billingState: z.string().regex(stateRegex, 'Invalid state'),
        billingPostalCode: z.string()
            .trim()
            .nonempty('This field is required')
            .min(3, 'Postal code must be at least 3 characters')
            .max(10, 'Postal code must be at most 10 characters')
            .regex(postalCodeRegex, 'Postal code must contain only letters, numbers, and spaces'),
    });

    // Computed schema based on payment method
    const activeSchema = computed(() => {
        if (paymentMethod.value === 'payPal') return basicSchema;
        if (paymentMethod.value === 'creditCard') return schema;
        return null; // No schema if no payment method selected
    });

    // error Define
    const errors = reactive<Record<string, string>>({
        shipFirstName: '',
        shipLastName: '',
        email: '',
        phoneNumber: '',
        shipStreetAddress: '',
        shipApptsAddress: '',
        shipCity: '',
        shipCountry: '',
        shipState: '',
        shipPostalCode: '',
        creditCardNumber: '',
        cardCVV: '',
        expiryMonth: '',
        expiryYear: '',
        billingFirstName: '',
        billingLastName: '',
        billingStreetAddress: '',
        billingApptsAddress: '',
        billingCity: '',
        billingCounty: '',
        billingState: '',
        billingPostalCode: '',
    })

    // Required Feilds
    const requiredFields: (keyof FormFields)[] = [
        'shipFirstName', 'shipLastName', 'email', 'phoneNumber', 'shipStreetAddress', 'shipCity', 'shipCountry', 'shipState', 'shipPostalCode', 'creditCardNumber', 'cardCVV', 'expiryMonth', 'expiryYear'
    ];

    const billingRequiredFields: (keyof FormFields)[] = [
        'billingFirstName', 'billingStreetAddress', 'billingCity', 'billingCounty', 'billingState', 'billingPostalCode'
    ];

    const getRequiredFields = () => {
        const fields: (keyof FormFields)[] = [
            'shipFirstName',
            'shipLastName',
            'email',
            'phoneNumber'
        ];

        if (paymentMethod.value === 'creditCard') {
            fields.push(
                'shipStreetAddress',
                'shipCity',
                'shipCountry',
                'shipState',
                'shipPostalCode',
                'creditCardNumber',
                'cardCVV',
                'expiryMonth',
                'expiryYear'
            );

            if (!sameBilling.value) {
                fields.push(...billingRequiredFields);
            }
        }

        return fields;
    };

    // Submit method
    const formSubmit = async () => {
        hasAttemptedSubmit.value = true;
        transactionStatus.value = true;
        globalError.value = '';

        // Clear previous errors
        Object.keys(errors).forEach((key) => {
            errors[key] = ''
        })

        // Check if payment method is selected
        if (!paymentMethod.value) {
            errors.paymentMethod = 'Please select a payment method';
            console.log('No payment method selected');
            return false;
        }

        handleBillSame(sameBilling.value);

        let hasEmpty = false;

        // Basic + Shipping + Payment
        const allRequired = getRequiredFields();

        // Add billing if using different billing address
        if (!sameBilling.value) {
            allRequired.push(...billingRequiredFields);
        }

        allRequired.forEach(field => {
            if (!formFields[field] || formFields[field].toString().trim() === '') {
                errors[field] = 'This field is required';
                hasEmpty = true;
            }
        });

        hasEmptyFields.value = hasEmpty;

        if (hasEmpty) {
            transactionStatus.value = false;
            return false;  // stop submission because some required fields are empty
        }

        // Use the active schema based on payment method
        const schema = activeSchema.value;
        if (!schema) {
            console.log('No schema available');
            return false;
        };

        // Use the active schema based on payment method
        const result = schema.safeParse(formFields)
        // console.log('formFields', JSON.stringify(formFields, null, 2))
        // console.log('Using schema for:', paymentMethod.value)

        if (!result.success) {
            const zodError = result.error as ZodError
            globalError.value = 'Please fix the highlighted fields above';

            zodError.issues.forEach((err) => {
                const field = err.path[0];
                if (typeof field === 'string') {
                    errors[field] = err.message;
                }
            })
            // console.log('errors:', JSON.stringify(errors, null, 2));

            transactionStatus.value = false;
            return false;
        };

        await importLead();
        await importOrder();
        transactionStatus.value = false;
        hasEmptyFields.value = false;
        return true
    }

    // check validation on input
    const validateField = async <K extends keyof typeof formFields>(key: K, value: string) => {

        if (!activeSchema.value) {
            formFields[key] = value;
            return;
        }

        const currentSchema = activeSchema.value.shape as any;
        const fieldSchema = currentSchema[key];

        if (!fieldSchema) {
            formFields[key] = value;
            return;
        }

        try {
            fieldSchema.parse(value)
            errors[key as string] = '' // Clear previous error
            globalError.value = '';
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                errors[key as string] = err.issues[0]?.message || 'Invalid input';
                globalError.value = 'Please fix the highlighted fields above';
            }
        } finally {
            formFields[key] = value; // update form values
            saveToStorage(key, value, 'session');
        }
    };

    // bill details same
    const billSame = () => {

        // Extra Protection
        if (!sameBilling.value) return;
        const shipCountry = formFields.shipCountry;

        formFields.billingFirstName = formFields.shipFirstName;
        formFields.billingLastName = formFields.shipLastName;
        formFields.billingStreetAddress = formFields.shipStreetAddress;
        formFields.billingApptsAddress = formFields.shipApptsAddress;
        formFields.billingCity = formFields.shipCity;
        formFields.billingCounty = shipCountry;
        formFields.billingPostalCode = formFields.shipPostalCode;

        // Update billing county and selected states
        handleCountry(shipCountry, 'bill');

        // Set billing state AFTER calling handleCountry
        formFields.billingState = formFields.shipState;

        // Clear billing errors
        const billingKeys: (keyof FormFields)[] = [
            'billingFirstName',
            'billingLastName',
            'billingStreetAddress',
            'billingApptsAddress',
            'billingCity',
            'billingCounty',
            'billingState',
            'billingPostalCode'
        ];

        billingKeys.forEach(key => {
            if (formFields[key] !== "") errors[key] = '';
        });
    };

    // clear billing fields when "use a different billing address"
    const clearBillingFields = () => {
        const billingKeys: (keyof FormFields)[] = [
            'billingFirstName',
            'billingLastName',
            'billingStreetAddress',
            'billingApptsAddress',
            'billingCity',
            'billingCounty',
            'billingState',
            'billingPostalCode'
        ];

        billingKeys.forEach(key => {
            formFields[key] = '';
            errors[key] = '';
        });

        // Clear selected states for billing as well
        checkoutStore.selectedStatesBill = [];
    };

    // Handle bill same status
    const handleBillSame = (status: boolean) => {
        sameBilling.value = status;
        // console.log('sameBilling:', sameBilling.value);
        if (status) billSame();
    };

    // Filter States
    const handleCountry = async (value: string, type: string = 'ship') => {
        const filteredStates = checkoutStore.allCountries.filter(country => country.countryCode === value);
        // console.log('checkoutStore.allCountries:', checkoutStore.allCountries);

        if (type !== 'ship') {
            // console.log("Same as shipping address")
            formFields.billingCounty = value;
            checkoutStore.selectedStatesBill = [...filteredStates];
            formFields.billingState = '';
            return;
        }
        console.log("handleCountry triggered for shipping")

        formFields.shipCountry = value;
        checkoutStore.selectedStates = [...filteredStates];
        formFields.shipState = '';
    };

    // clear the error of specific input fields
    const handleError = (keys: (keyof typeof errors)[]) => {
        keys.forEach(key => {
            errors[key] = ''
        })
    }

    return {
        paymentMethod,  // Export payment method
        sameBilling,
        formFields,
        errors,
        formSubmit,
        validateField,
        billSame,
        handleBillSame,
        handleCountry,
        transactionStatus,
        orderDetails,
        hasEmptyFields,
        hasAttemptedSubmit,
        apiErrorAlert,
        handleError,
        hasAnyError,
        globalError,
        formMessage
    }
});
