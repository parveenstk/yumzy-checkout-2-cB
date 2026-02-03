<script setup lang="ts">
const props = defineProps<{
    id?: string
    modelValue: string
    name: string
    autocomplete?: string
    error?: string
    placeholder?: string
    type?: string
    maxlength?: number
    onFocus?: () => void
}>()

const emit = defineEmits(['update:modelValue', 'input'])

const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    emit('update:modelValue', value)
    emit('input', value)
}
</script>

<template>
    <div>
        <input :id="id" :value="modelValue" :name="name" :autocomplete="autocomplete" :type="type || 'text'"
            :placeholder="placeholder" @focus="onFocus" :maxlength="maxlength" @input="onInput" :class="[
                'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                error ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500'
            ]" />

        <p v-if="error" class="ml-2 mt-1 text-sm text-[#e6193c]">
            {{ error }}
        </p>
    </div>
</template>