import math
from fractions import Fraction
import re

class MathValue:
    """Wrapper class to handle both rational and irrational numbers"""
    def __init__(self, value, is_irrational=False, irrational_type=None, expression=None):
        self.value = value  # For rational: Fraction, for irrational: float
        self.is_irrational = is_irrational
        self.irrational_type = irrational_type  # 'sqrt', 'pi', 'e', 'trig'
        self.expression = expression  # Original expression like "√2", "π", "sin(30)"
    
    def __add__(self, other):
        if self.is_irrational or other.is_irrational:
            # For irrationals, we need to compute numerically
            return MathValue(float(self) + float(other), True, 'computed')
        return MathValue(self.value + other.value)
    
    def __sub__(self, other):
        if self.is_irrational or other.is_irrational:
            return MathValue(float(self) - float(other), True, 'computed')
        return MathValue(self.value - other.value)
    
    def __mul__(self, other):
        if self.is_irrational or other.is_irrational:
            return MathValue(float(self) * float(other), True, 'computed')
        return MathValue(self.value * other.value)
    
    def __truediv__(self, other):
        if self.is_irrational or other.is_irrational:
            return MathValue(float(self) / float(other), True, 'computed')
        return MathValue(self.value / other.value)
    
    def __pow__(self, other):
        if self.is_irrational or other.is_irrational:
            return MathValue(float(self) ** float(other), True, 'computed')
        return MathValue(self.value ** other.value)
    
    def __float__(self):
        if self.is_irrational:
            return self.value
        else:
            return float(self.value)
    
    def __eq__(self, other):
        return abs(float(self) - float(other)) < 1e-10
    
    def __str__(self):
        if self.is_irrational:
            if self.expression:
                return self.expression
            elif self.irrational_type == 'pi':
                return "π"
            elif self.irrational_type == 'e':
                return "e"
            elif self.irrational_type == 'sqrt':
                return f"√{self.expression}" if self.expression else "√2"
            else:
                return f"{self.value:.6f}"
        else:
            if self.value.denominator == 1:
                return f"{self.value.numerator}"
            else:
                return f"{self.value.numerator}/{self.value.denominator}"

class ASTNode:
    """Node in Abstract Syntax Tree"""
    def __init__(self, node_type, value=None, left=None, right=None):
        self.node_type = node_type  # 'number', 'operator', 'parentheses', 'function'
        self.value = value
        self.left = left
        self.right = right
        self.original_string = None
    
    def __str__(self):
        if self.node_type == 'number':
            return str(self.value)
        elif self.node_type == 'operator':
            return f"({self.left} {self.value} {self.right})"
        elif self.node_type == 'parentheses':
            return f"({self.left})"
        elif self.node_type == 'function':
            return f"{self.value}({self.left})"
        return f"{self.node_type}:{self.value}"

class ExpressionEvaluator:
    def __init__(self):
        self.operators = {
            '+': (1, lambda a, b: a + b, 'addition'),
            '-': (2, lambda a, b: a - b, 'subtraction'), 
            '*': (3, lambda a, b: a * b, 'multiplication'),
            '/': (4, lambda a, b: a / b, 'division'),
            '^': (5, lambda a, b: a ** b, 'exponent')
        }
        
        self.functions = {
            'sqrt': (lambda x: MathValue(math.sqrt(float(x)), True, 'sqrt', f"√{x}")),
            'sin': (lambda x: MathValue(math.sin(math.radians(float(x))), True, 'trig', f"sin({x})")),
            'cos': (lambda x: MathValue(math.cos(math.radians(float(x))), True, 'trig', f"cos({x})")),
            'tan': (lambda x: MathValue(math.tan(math.radians(float(x))), True, 'trig', f"tan({x})")),
            'log': (lambda x: MathValue(math.log10(float(x)), True, 'trig', f"log({x})")),
            'ln': (lambda x: MathValue(math.log(float(x)), True, 'trig', f"ln({x})"))
        }
        
        self.constants = {
            'pi': MathValue(math.pi, True, 'pi', 'π'),
            'e': MathValue(math.e, True, 'e', 'e'),
            'π': MathValue(math.pi, True, 'pi', 'π')
        }
    
    def preprocess_expression(self, expression):
        """Preprocess and validate the expression"""
        expression = expression.replace(' ', '').lower()
        expression = self._normalize_operators(expression)
        expression = self._handle_negatives(expression)
        expression = self._handle_square_roots(expression)
        
        if not self._validate_parentheses(expression):
            raise ValueError("Mismatched parentheses or brackets")
        
        return expression
    
    def _normalize_operators(self, expression):
        """Normalize different operator representations"""
        return expression.replace('×', '*').replace('÷', '/')
    
    def _handle_negatives(self, expression):
        """Handle negative numbers for proper parsing"""
        # Add zero before negative at start
        if expression.startswith('-'):
            expression = '0' + expression
        
        # Handle negative numbers after operators or opening parentheses
        expression = re.sub(r'\(-', '(0-', expression)
        expression = re.sub(r'(\+|-|\*|/)-', r'\g<1>0-', expression)
        
        return expression
    
    def _handle_square_roots(self, expression):
        """Convert √ symbol to sqrt function"""
        return expression.replace('√', 'sqrt')
    
    def _validate_parentheses(self, expression):
        """Validate that parentheses are properly matched"""
        stack = []
        for char in expression:
            if char == '(':
                stack.append(char)
            elif char == ')':
                if not stack:
                    return False
                stack.pop()
        return len(stack) == 0
    
    def build_ast(self, expression):
        """Build Abstract Syntax Tree from expression"""
        tokens = self._tokenize(expression)
        ast = self._parse_expression(tokens)
        if not ast:
            raise ValueError("Could not parse expression")
        return ast
    
    def _tokenize(self, expression):
        """Tokenize expression into numbers, operators, functions, and parentheses"""
        # Enhanced regex to handle functions, constants, and numbers
        token_pattern = r'\d+\.?\d*|/\d+\.?\d*|[a-z]+|[-+*/^()]'
        tokens = re.findall(token_pattern, expression)
        return tokens
    
    def _parse_expression(self, tokens):
        """Parse tokens into AST using shunting yard algorithm"""
        output = []
        stack = []
        i = 0
        
        while i < len(tokens):
            token = tokens[i]
            
            # Check for constants
            if token in self.constants:
                output.append(ASTNode('number', self.constants[token]))
                i += 1
                
            # Check for functions
            elif token in self.functions and i + 1 < len(tokens) and tokens[i + 1] == '(':
                stack.append(token)
                i += 1
                
            elif token.isdigit() or (token.startswith('/') and token[1:].isdigit()):
                # Number
                number = self._parse_number(token)
                output.append(ASTNode('number', number))
                i += 1
                
            elif token == '(':
                # Left parenthesis
                stack.append(token)
                i += 1
                
            elif token == ')':
                # Right parenthesis - pop until left parenthesis
                while stack and stack[-1] != '(':
                    if stack[-1] in self.functions:
                        # Handle function application
                        func = stack.pop()
                        if output:
                            arg = output.pop()
                            output.append(ASTNode('function', func, arg, None))
                    else:
                        output.append(self._create_operator_node(stack.pop(), output))
                
                if stack and stack[-1] == '(':
                    stack.pop()  # Remove the '('
                
                i += 1
                
            elif token in self.operators:
                # Operator
                precedence = self.operators[token][0]
                while (stack and stack[-1] in self.operators and 
                       self.operators[stack[-1]][0] >= precedence):
                    output.append(self._create_operator_node(stack.pop(), output))
                stack.append(token)
                i += 1
                
            else:
                i += 1  # Skip unknown tokens
        
        # Process remaining operators and functions
        while stack:
            if stack[-1] == '(':
                raise ValueError("Mismatched parentheses")
            elif stack[-1] in self.functions:
                func = stack.pop()
                if output:
                    arg = output.pop()
                    output.append(ASTNode('function', func, arg, None))
            else:
                output.append(self._create_operator_node(stack.pop(), output))
        
        if len(output) != 1:
            raise ValueError("Invalid expression - could not parse completely")
        
        return output[0]
    
    def _create_operator_node(self, operator, output):
        """Create an operator node from the operator and output stack"""
        if len(output) < 2:
            raise ValueError(f"Not enough operands for operator '{operator}'")
        
        right = output.pop()
        left = output.pop()
        return ASTNode('operator', operator, left, right)
    
    def _parse_number(self, token):
        """Parse token into MathValue"""
        if token.startswith('/'):
            # Fraction like /2 means 1/2
            return MathValue(Fraction(1, int(token[1:])))
        elif '/' in token:
            # Regular fraction
            parts = token.split('/')
            return MathValue(Fraction(int(parts[0]), int(parts[1])))
        elif '.' in token:
            # Decimal
            return MathValue(Fraction(float(token)).limit_denominator())
        else:
            # Integer
            return MathValue(Fraction(int(token)))
    
    def ast_to_string(self, node):
        """Convert AST back to string representation"""
        if node.node_type == 'number':
            return str(node.value)
        elif node.node_type == 'operator':
            left_str = self.ast_to_string(node.left)
            right_str = self.ast_to_string(node.right)
            return f"{left_str} {node.value} {right_str}"
        elif node.node_type == 'parentheses':
            return f"({self.ast_to_string(node.left)})"
        elif node.node_type == 'function':
            arg_str = self.ast_to_string(node.left)
            return f"{node.value}({arg_str})"
        return ""
    
    def _format_math_value(self, math_value):
        """Format MathValue as string"""
        return str(math_value)
    
    def evaluate_ast(self, node):
        """Evaluate AST recursively"""
        if node.node_type == 'number':
            return node.value
        elif node.node_type == 'operator':
            left_val = self.evaluate_ast(node.left)
            right_val = self.evaluate_ast(node.right)
            _, operation, _ = self.operators[node.value]
            return operation(left_val, right_val)
        elif node.node_type == 'parentheses':
            return self.evaluate_ast(node.left)
        elif node.node_type == 'function':
            arg_val = self.evaluate_ast(node.left)
            return self.functions[node.value](arg_val)
        
        raise ValueError(f"Unknown node type: {node.node_type}")
    
    def evaluate_directly(self, expression):
        """Evaluate expression directly"""
        processed_expr = self.preprocess_expression(expression)
        ast = self.build_ast(processed_expr)
        return self.evaluate_ast(ast)

class StepByStepCalculator:
    def __init__(self, evaluator):
        self.evaluator = evaluator
        self.steps = []
    
    def calculate_with_steps(self, expression):
        """Calculate expression with detailed steps"""
        self.steps = []
        
        self.steps.append(f"📝 Original expression: {expression}")
        
        # Preprocess
        processed_expr = self.evaluator.preprocess_expression(expression)
        self.steps.append(f"🔧 Preprocessed expression: {processed_expr}")
        
        # Build AST
        ast = self.evaluator.build_ast(processed_expr)
        self.steps.append(f"🌳 Built expression tree")
        
        # Evaluate with steps
        result = self._evaluate_ast_with_steps(ast)
        
        self.steps.append(f"✅ Final result: {self.evaluator._format_math_value(result)}")
        if result.is_irrational:
            self.steps.append(f"📊 Decimal approximation: {float(result):.10f}")
        return result
    
    def _evaluate_ast_with_steps(self, node, step_count=[0]):
        """Evaluate AST while recording steps"""
        if node.node_type == 'number':
            return node.value
        
        elif node.node_type == 'parentheses':
            step_count[0] += 1
            original_str = f"({self.evaluator.ast_to_string(node.left)})"
            self.steps.append(f"\n🎯 Step {step_count[0]}: Evaluate parentheses")
            self.steps.append(f"   Expression: {original_str}")
            
            result = self._evaluate_ast_with_steps(node.left, step_count)
            
            self.steps.append(f"   Result: {self.evaluator._format_math_value(result)}")
            return result
        
        elif node.node_type == 'function':
            step_count[0] += 1
            arg_val = self._evaluate_ast_with_steps(node.left, step_count)
            
            func_name = node.value
            original_str = f"{func_name}({self.evaluator._format_math_value(arg_val)})"
            
            self.steps.append(f"\n🎯 Step {step_count[0]}: Evaluate function {func_name}")
            self.steps.append(f"   Expression: {original_str}")
            
            result = self.evaluator.functions[func_name](arg_val)
            
            if func_name == 'sqrt':
                self.steps.append(f"   Calculate: √{float(arg_val):.4f} = {float(result):.6f}")
            elif func_name in ['sin', 'cos', 'tan']:
                self.steps.append(f"   Calculate: {func_name}({float(arg_val)}°) = {float(result):.6f}")
            else:
                self.steps.append(f"   Calculate: {func_name}({float(arg_val):.4f}) = {float(result):.6f}")
            
            self.steps.append(f"   Result: {self.evaluator._format_math_value(result)}")
            return result
        
        elif node.node_type == 'operator':
            # First evaluate left and right subtrees
            left_val = self._evaluate_ast_with_steps(node.left, step_count)
            right_val = self._evaluate_ast_with_steps(node.right, step_count)
            
            # Now perform the operation
            step_count[0] += 1
            operator = node.value
            _, operation, op_name = self.evaluator.operators[operator]
            
            left_str = self.evaluator._format_math_value(left_val)
            right_str = self.evaluator._format_math_value(right_val)
            
            self.steps.append(f"\n🎯 Step {step_count[0]}: Perform {op_name}")
            self.steps.append(f"   Operation: {left_str} {operator} {right_str}")
            
            try:
                result = operation(left_val, right_val)
                
                # Show calculation details
                if left_val.is_irrational or right_val.is_irrational:
                    self.steps.append(f"   Calculate: {float(left_val):.6f} {operator} {float(right_val):.6f} = {float(result):.6f}")
                else:
                    if operator == '+':
                        self.steps.append(f"   Calculate: {left_val.value.numerator} + {right_val.value.numerator} = {result.value.numerator}")
                    elif operator == '-':
                        self.steps.append(f"   Calculate: {left_val.value.numerator} - {right_val.value.numerator} = {result.value.numerator}")
                    elif operator == '*':
                        self.steps.append(f"   Calculate: {left_val.value.numerator} × {right_val.value.numerator} = {result.value.numerator}")
                    elif operator == '/':
                        self.steps.append(f"   Calculate: {left_val.value.numerator} ÷ {right_val.value.numerator} = {self.evaluator._format_math_value(result)}")
                    elif operator == '^':
                        self.steps.append(f"   Calculate: {left_val.value.numerator}^{right_val.value.numerator} = {result.value.numerator}")
                
                self.steps.append(f"   Result: {self.evaluator._format_math_value(result)}")
                return result
                
            except ZeroDivisionError:
                self.steps.append(f"   ❌ Error: Division by zero!")
                raise ZeroDivisionError(f"Division by zero in {left_str} {operator} {right_str}")
    
    def show_steps(self):
        """Display all calculation steps"""
        print("\n🧮 CALCULATION STEPS:")
        print("=" * 70)
        for i, step in enumerate(self.steps, 1):
            print(f"{i:2d}. {step}")
        print("=" * 70)
    
    def get_steps(self):
        """Get steps as list"""
        return self.steps.copy()

def main():
    """Main function for personalized expression evaluation"""
    print("🧮 ADVANCED STEP-BY-STEP CALCULATOR")
    print("=" * 60)
    print("Supported operations: +, -, *, /, ^, ()")
    print("Functions: sqrt(), sin(), cos(), tan(), log(), ln()")
    print("Constants: π (pi), e")
    print("Examples: 2+3*4, √2, π/2, sin(30), 2π, √(9+16)")
    print("=" * 60)
    
    while True:
        try:
            # Get expression from user
            user_expression = input("\nEnter your expression (or 'quit' to exit): ").strip()
            
            if user_expression.lower() in ['quit', 'exit', 'q']:
                print("Goodbye! 👋")
                break
            
            if not user_expression:
                print("Please enter an expression.")
                continue
            
            print(f"\nCalculating: {user_expression}")
            print("-" * 50)
            
            # Create evaluator and calculator
            evaluator = ExpressionEvaluator()
            calculator = StepByStepCalculator(evaluator)
            
            # Calculate with steps
            result = calculator.calculate_with_steps(user_expression)
            
            # Show all steps
            calculator.show_steps()
            
            # Show final result prominently
            final_value = calculator.evaluator._format_math_value(result)
            print(f"\n🎊 FINAL RESULT: {user_expression} = {final_value}")
            if result.is_irrational:
                print(f"📊 Decimal approximation: {float(result):.10f}")
            
            # Ask if user wants to continue
            continue_calc = input("\nDo you want to calculate another expression? (y/n): ").strip().lower()
            if continue_calc not in ['y', 'yes']:
                print("Thanks for using the calculator! 👋")
                break
                
        except ValueError as e:
            print(f"❌ Error: {e}")
            print("Please check your expression and try again.")
        except ZeroDivisionError as e:
            print(f"❌ Error: {e}")
            print("Division by zero is not allowed.")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            print("Please check your expression format.")

def demonstrate_irrational_examples():
    """Show examples of irrational number calculations"""
    examples = [
        "√2",
        "π",
        "2π",
        "√2 + √2", 
        "π/2",
        "sin(30)",
        "cos(45)",
        "√(9 + 16)",
        "2 * π * 3",
        "log(100)",
        "ln(e^2)"
    ]
    
    print("\n" + "="*60)
    print("IRRATIONAL NUMBER EXAMPLES")
    print("="*60)
    
    evaluator = ExpressionEvaluator()
    
    for example in examples:
        try:
            calculator = StepByStepCalculator(evaluator)
            result = calculator.calculate_with_steps(example)
            print(f"\n{example} = {calculator.evaluator._format_math_value(result)}")
            if result.is_irrational:
                print(f"   Decimal: {float(result):.8f}")
        except Exception as e:
            print(f"\n{example} → Error: {e}")

# Run the calculator
if __name__ == "__main__":
    print("Choose mode:")
    print("1. Interactive calculator")
    print("2. See irrational number examples")
    print("3. One-time calculation")
    
    choice = input("Enter your choice (1, 2, or 3): ").strip()
    
    if choice == "1":
        main()
    elif choice == "2":
        demonstrate_irrational_examples()
    elif choice == "3":
        user_expression = input("Enter your expression: ")
        evaluator = ExpressionEvaluator()
        calculator = StepByStepCalculator(evaluator)
        result = calculator.calculate_with_steps(user_expression)
        calculator.show_steps()
        print(f"\n🎊 FINAL RESULT: {user_expression} = {calculator.evaluator._format_math_value(result)}")
        if result.is_irrational:
            print(f"📊 Decimal approximation: {float(result):.10f}")
    else:
        print("Invalid choice. Running interactive mode...")
        main()
        
        