def ensemble(a):
    a = a.replace(" ", "")
    b = ""
    if(a.find("+") != -1) or (a.find("-") != -1):
        c = a.split("+")
        c = a.split("-")
        if (a.find("i") != -1):
            for x in c:
                x = x.replace("i" ,"")
                if (x == ""):
                    x = 1
                if (x.find("/") != -1):
                    d = x.split("/")
                    if (int(d[1]) != 0):
                        b = "C"
                    else:
                        b = "?"
                        break
                elif(float(x)):
                    b = "C"
    elif(a.find("i") != -1):
        c = a.replace("i","")
        if (c == ""):
            c = 1
        if(a.find("/") != -1):
            c = a.split("/")
            if (int(c[1]) != 0):
                b = "iR"
            else:
                b = "?"
        elif(float(c)):
            b = "iR"
    elif(a.find("/") != -1):
        c = a.split("/")
        if (int(c[1]) != 0):
            b = "Q"
        else:
            b = "?"
    elif (a.find("-") != -1):
        c = a.replace("-","")
        if(float(c)):
            b = "R"
        elif(int(c)):
            b = "Z"
    elif(float(a)):
        b = "R"
    elif(int(a)):
        b = "N"
    else:
        b = "?"

    print(a + " appartenant à " + b)


u = input("entrer une valeur")
while (u != "0") and (u != ""):
    ensemble(u)
    u = input("entrer une valeur")
