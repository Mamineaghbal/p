import math as m

e = 2.718281
pi = 3.141592

def exp(x):
    y = m.pow(e,x)
    y = round(y,3)
    return y

def ln(x):
    if (x > 0):
        t = x
        y = 0
        d = m.pow(e,0.001)
        while t > 1:
            if (t >= e):
               t = t / e
               y += 1
            else:
                t = t / d
                y += 0.001
        y = round(y,3)
        return y
    else:
        return "n'existe pas"

def sin(x):
    y = m.sin(x)
    y = round(y,3)
    return y

def a_exp(x,a):
    y = m.pow(a,x)
    y = round(y,3)
    return y


def a_log(x,a):
    if (x > 0):
        t = x
        y = 0
        d = m.pow(a,0.001)
        while t > 1:
            if (t >= a):
               t = t / a
               y += 1
            else:
                t = t / d
                y += 0.001
        y = round(y,3)
        return y
    else:
        return "n'existe pas"


a = input("Entrer une valeur : ")
if (a == "pi"):
    a = pi
elif (a == "e"):
    a = e
else:
    a = float(a)


print(f"f(x) = exp(x);\nf({a}) = exp({a}) = {exp(a)}")
print(f"f(x) = ln(x);\nf({a}) = ln({a}) = {ln(a)}")
print(f"f(x) = sin(x);\nf({a}) = sin({a}) = {sin(a)}")

print(f"f(x) = (b)^x et g(x) = log[b](x);\n")

b = input("saisir la valeur de b > 0 ")


if (b == "pi"):
        b = pi
elif (b == "e"):
        b = e
else:
    b = float(b)
    while (b <= 0):
        print("")
        b = input("saisir la valeur de b > 0 ")


print(f"f(x) = ({b})^x;\nf({a}) = ({b})^{a} = {a_exp(a,b)}")
print(f"f(x) = log[{b}](x);\nf({a}) = log[{b}]({a}) = {a_log(a,b)}")
