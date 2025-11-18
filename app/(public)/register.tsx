import { Button } from '@/components/Genericos/Button';
import { Input, PasswordInput } from '@/components/Genericos/Input';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/hooks/useToast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
	const { register } = useAuth();
	const toast = useToast();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const validate = () => {
		if (!name.trim()) {
			toast.error('Erro de validação', 'Nome é obrigatório');
			return false;
		}
		if (!email.trim()) {
			toast.error('Erro de validação', 'Email é obrigatório');
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error('Erro de validação', 'Email inválido');
			return false;
		}
		if (!password) {
			toast.error('Erro de validação', 'Senha é obrigatória');
			return false;
		}
		if (password.length < 6) {
			toast.error('Erro de validação', 'A senha deve ter pelo menos 6 caracteres');
			return false;
		}
		if (password !== confirmPassword) {
			toast.error('Erro de validação', 'As senhas não coincidem');
			return false;
		}
		return true;
	};

	const handleRegister = async () => {
		if (!validate()) return;
		setLoading(true);
		try {
			// Usar a função register do Supabase
			await register(email, password, name);
			toast.success('Sucesso!', 'Conta criada com sucesso. Bem-vindo ao Bookly!');
			router.replace('/(private)/home');
		} catch (err: any) {
			console.error('Erro no registro:', err);
			
			// Tratamento específico de erros do Supabase
			if (err?.message?.includes('email already registered')) {
				toast.error('Erro no cadastro', 'Este email já está cadastrado. Tente fazer login.');
			} else if (err?.message?.includes('password')) {
				toast.error('Erro no cadastro', 'Senha muito fraca. Use pelo menos 6 caracteres.');
			} else if (err?.message?.includes('email')) {
				toast.error('Erro no cadastro', 'Email inválido.');
			} else {
				toast.error('Erro no cadastro', err?.message || 'Falha ao criar a conta. Tente novamente.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>Crie sua conta</Text>
				<Text style={styles.subtitle}>Bem-vindo ao Bookly — cadastre-se para continuar</Text>

				<View style={styles.form}>
					<Input
						placeholder="Nome"
						value={name}
						onChange={(e: any) => setName(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
						mb={3}
					/>

					<Input
						placeholder="Email"
						value={email}
						onChange={(e: any) => setEmail(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
						mb={3}
					/>

					<PasswordInput
						placeholder="Senha"
						value={password}
						onChange={(e: any) => setPassword(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
						mb={3}
						visibilityIcon={{ on: <LuEye size={18} />, off: <LuEyeOff size={18} /> }}
					/>

					<PasswordInput
						placeholder="Confirmar senha"
						value={confirmPassword}
						onChange={(e: any) => setConfirmPassword(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
						mb={6}
						visibilityIcon={{ on: <LuEye size={18} />, off: <LuEyeOff size={18} /> }}
					/>

					<View style={styles.buttonContainer}>
						<Button size="lg" variant="solid" onPress={handleRegister} loading={loading}>
							Cadastrar
						</Button>
					</View>

					<View style={{ marginTop: 12 }}>
						<Text style={styles.subtitle}>Já tem uma conta? <Text style={styles.link} onPress={() => router.push('/(public)/login')}>Entrar</Text></Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 36,
		fontWeight: '700',
		color: '#2D3748',
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 18,
		color: '#718096',
		marginBottom: 18,
		textAlign: 'center',
	},
	form: {
		width: '100%',
		maxWidth: 360,
	},
	buttonContainer: {
		width: '100%',
	},
	link: {
		color: '#3182CE',
	},
});

