def som(l):
    t = 0
    for i in range(len(l)):
        t += l[i]
    return t

def p(x,l,n):
    t = 0
    if len(l) >= n:

        for i in range(n):
            t += l[i]*(x**i)
        return t
    else:
        t = "impossible"
        return t

 


x = int(input("un nombre"))
r = ""
if (x == 0):
    r = "0"
else:
    while x != 0:
        r = str(x % 2) + r
        x = x // 2

print("le nombre binaire:",r)